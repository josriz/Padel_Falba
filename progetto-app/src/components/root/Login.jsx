import React from 'react';
import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function PlaytomicStyleLogin() {
  return (
    <div className="min-h-screen flex">
      
      {/* Sezione immagine/branding lato sinistro */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-600 items-center justify-center">
        <img
          src="https://yourdomain.com/path-to-playtomic-like-image.jpg"
          alt="Playtomic style branding"
          className="max-w-md rounded-lg shadow-lg"
        />
      </div>

      {/* Sezione login lato destro */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-10 bg-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">Benvenuto in Playtomic</h1>
        <p className="mb-10 text-gray-600 max-w-md text-center">
          Effettua il login per entrare nella community padel più amata.
        </p>
        <div className="w-full max-w-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={['google', 'facebook']}
            socialLayout="horizontal"
            redirectTo={window.location.origin + '/dashboard'}
          />
        </div>
      </div>
    </div>
  );
}
