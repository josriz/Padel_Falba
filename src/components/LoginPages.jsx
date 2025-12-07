// src/components/LoginPages.jsx - ✅ BANNER CON TUE FOTO MARKETPLACE_ITEMS
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { LogIn, UserPlus, Loader2, AlertCircle, CheckCircle, ShieldCheck, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';

const LoginPages = () => {
  const { user, role, signIn } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);

  const [email, setEmail] = useState('giose.rizzi@gmail.com');
  const [password, setPassword] = useState('Share1968');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  const validateImageUrl = (url) => {
    return new Promise((resolve) => {
      if (!url || typeof url !== 'string' || url.trim() === '') return resolve(false);
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  useEffect(() => {
    const fetchMarketplaceImages = async () => {
      try {
        const { data, error } = await supabase
          .from('marketplace_items')
          .select('immagine_url')
          .eq('venduto', false)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        const rawUrls =
          data
            ?.filter((item) => item.immagine_url && item.immagine_url.trim() !== '')
            ?.map((item) => item.immagine_url)
            ?.slice(0, 8) || [];

        const validity = await Promise.all(rawUrls.map((u) => validateImageUrl(u)));
        const validUrls = rawUrls.filter((_, idx) => validity[idx]);

        if (validUrls.length === 0) {
          setBannerImages([
            'https://images.unsplash.com/photo-1620102408085-8c9dfd5a2b6f?w=400&h=100&fit=crop',
          ]);
        } else {
          setBannerImages(validUrls);
        }
      } catch (err) {
        setBannerImages([
          'https://images.unsplash.com/photo-1620102408085-8c9dfd5a2b6f?w=400&h=100&fit=crop',
        ]);
      }
    };

    fetchMarketplaceImages();
  }, []);

  useEffect(() => {
    if (bannerImages.length > 0) {
      const interval = setInterval(() => {
        setBannerIndex((prev) => (prev + 1) % bannerImages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [bannerImages.length]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage({ type: null, text: '' }), 7000);
  };

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (user) {
      showMessage('success', `✅ Benvenuto ${user.email}`);
      setTimeout(() => navigate('/'), 1500);
    }
  }, [user, navigate]);

  const handleTestSignup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'admin' } },
      });
      if (error) throw error;
      showMessage('success', '✅ Registrato! Ora fai LOGIN');
    } catch (err) {
      showMessage('error', 'Signup fallito: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      if (isSignUp) {
        await handleTestSignup();
      } else {
        await signIn(email, password);
        showMessage('success', `✅ Accesso riuscito ${email}`);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      showMessage('error', err.message || 'Errore durante autenticazione');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err) {
      showMessage('error', `OAuth ${provider} fallito - usa email`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showMessage('error', 'Inserisci la tua email per il reset');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      showMessage('success', '📧 Email per reset password inviata');
    } catch (err) {
      showMessage('error', err.message || 'Errore durante reset password');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage({ type: null, text: '' });
  };

  const isInputValid = email.length > 0 && password.length >= (isSignUp ? 8 : 6);
  const SubmitIcon = isSignUp ? UserPlus : LogIn;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4">
      <div className="bg-white p-6 max-w-md w-full">

        {/* LOGO */}
        <div className="text-center mb-8 pt-8">
          <img
            src="/logo.png"
            alt="CIEFFE Padel"
            className="mx-auto w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 mb-6 shadow-xl rounded-2xl hover:scale-110 transition-all duration-300"
          />

          {/* 🔵 BANDA BLU SOTTO LOGO */}
          <div className="w-full h-3 bg-blue-600 rounded-full mb-6 shadow-md"></div>

          <p className="text-sm font-bold italic text-gray-900 tracking-wide mb-4 drop-shadow-sm">
            <span className="not-italic font-semibold text-gray-800 mr-1">by</span>
            Claudio Falba
          </p>

          {/* BANNER MARKETPLACE */}
          <div className="w-full h-20 rounded-2xl overflow-hidden shadow-lg mb-6 relative bg-gray-200">
            {bannerImages.length > 0 ? (
              <img
                src={bannerImages[bannerIndex]}
                alt="Marketplace"
                className="w-full h-full object-cover transition-all duration-700"
                loading="eager"
                onError={() => {
                  setBannerIndex((prev) => (prev + 1) % bannerImages.length);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse flex items-center justify-center">
                <span className="text-white text-xs font-bold">Caricando...</span>
              </div>
            )}

            <div className="absolute top-2 right-3 flex gap-1">
              {bannerImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === bannerIndex ? 'w-4 bg-emerald-500 shadow-lg' : 'bg-white/60'
                  }`}
                  onClick={() => setBannerIndex(i)}
                />
              ))}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Accedi a CIEFFE Padel</h1>
          <p className="text-sm text-gray-600">Gestisci tornei PADEL 2vs2</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <LogIn className="w-4 h-4 text-emerald-600" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="giose.rizzi@gmail.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
                minLength={isSignUp ? 8 : 6}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-all group"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end text-sm mb-2">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-emerald-600 hover:underline font-medium flex items-center gap-1"
            >
              <Key className="w-3 h-3" />
              Reset Password
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !isInputValid}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${
              isInputValid && !loading
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Elaborazione...
              </>
            ) : (
              <>
                <SubmitIcon className="w-5 h-5" /> {isSignUp ? 'Crea Account' : 'Accedi'}
              </>
            )}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-2 text-xs text-gray-400">oppure</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="flex items-center justify-center w-full py-2 px-3 rounded-xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-gray-50 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          >
            <FcGoogle className="w-5 h-5 mr-2" /> Accedi con Google
          </button>
          <button
            onClick={() => handleOAuthLogin('facebook')}
            disabled={loading}
            className="flex items-center justify-center w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all text-sm"
          >
            <FaFacebook className="w-5 h-5 mr-2" /> Accedi con Facebook
          </button>
        </div>

        {message.type && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-start gap-2 shadow-sm border text-sm ${
              message.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={toggleMode}
            className="text-gray-900 hover:text-emerald-600 font-semibold text-sm hover:underline transition-all"
          >
            {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
          <p className="mb-1 text-sm leading-relaxed">
            Registrandoti accetti le nostre{' '}
            <span className="font-semibold text-emerald-600 hover:underline cursor-pointer transition-all">
              Condizioni di uso
            </span>{' '}
            e la{' '}
            <span className="font-semibold text-emerald-600 hover:underline cursor-pointer transition-all">
              politica sulla privacy
            </span>
          </p>
          <p className="font-bold italic text-gray-900 text-sm tracking-wide drop-shadow-sm">@ Josè Rizzi</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPages;
