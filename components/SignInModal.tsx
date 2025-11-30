"use client";

import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { t, isRTL } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const success = await signUp(email, password, name);
        if (success) {
          toast.success(isRTL ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
          onOpenChange(false);
          resetForm();
        } else {
          toast.error(isRTL ? 'فشل إنشاء الحساب' : 'Failed to create account');
        }
      } else {
        const success = await signIn(email, password);
        if (success) {
          toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully');
          onOpenChange(false);
          resetForm();
        } else {
          toast.error(isRTL ? 'فشل تسجيل الدخول' : 'Failed to sign in');
        }
      }
    } catch (error) {
      toast.error(isRTL ? 'حدث خطأ ما' : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const success = await signInWithGoogle();
      if (success) {
        toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully');
        onOpenChange(false);
        resetForm();
      } else {
        toast.error(isRTL ? 'فشل تسجيل الدخول' : 'Failed to sign in');
      }
    } catch (error) {
      toast.error(isRTL ? 'حدث خطأ ما' : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setIsSignUp(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {isSignUp
              ? (isRTL ? 'إنشاء حساب جديد' : 'Create New Account')
              : (isRTL ? 'تسجيل الدخول' : 'Sign In')
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isRTL ? 'الاسم' : 'Name'}
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                  required={isSignUp}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                required
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                required
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5FB57A] hover:bg-[#4FA569] text-white"
              disabled={isLoading}
            >
              {isLoading
                ? (isRTL ? 'جاري التحميل...' : 'Loading...')
                : (isSignUp
                    ? (isRTL ? 'إنشاء حساب' : 'Create Account')
                    : (isRTL ? 'تسجيل الدخول' : 'Sign In')
                  )
              }
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {isRTL ? 'أو' : 'OR'}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'تسجيل الدخول بحساب جوجل' : 'Continue with Google'}
          </Button>

          <div className="text-center text-sm">
            {isSignUp ? (
              <>
                {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-[#5FB57A] hover:underline"
                >
                  {isRTL ? 'تسجيل الدخول' : 'Sign in'}
                </button>
              </>
            ) : (
              <>
                {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-[#5FB57A] hover:underline"
                >
                  {isRTL ? 'إنشاء حساب' : 'Sign up'}
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}