import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, Phone } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const { signIn } = useAuth();
  const { isRTL } = useLanguage();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.trim().length < 10) {
      setError(isRTL ? 'الرجاء إدخال رقم هاتف صحيح' : 'Please enter a valid phone number');
      return;
    }

    setError('');
    setLoading(true);

    console.log('📞 Saving phone number:', phone);

    const result = await signIn(phone);
    setLoading(false);

    console.log('✅ Result:', result);

    if (result.success) {
      console.log('🎉 Success! Closing modal');
      onOpenChange(false);
      setPhone('');
    } else {
      console.error('❌ Error:', result.error);
      setError(result.error || (isRTL ? 'فشل حفظ رقم الهاتف' : 'Failed to save phone number'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </DialogTitle>
          <DialogDescription>
            {isRTL 
              ? 'أدخل رقم هاتفك للمتابعة'
              : 'Enter your phone number to continue'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSignIn} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">
              {isRTL ? 'رقم الهاتف' : 'Phone Number'}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={isRTL ? '+966 5X XXX XXXX' : '+966 5X XXX XXXX'}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              required
              dir="ltr"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !phone}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </>
            ) : (
              isRTL ? 'تسجيل الدخول' : 'Sign In'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
