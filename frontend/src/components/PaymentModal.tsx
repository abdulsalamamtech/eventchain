import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Coins, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface PaymentModalProps {
  eventTitle: string;
  price: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentModal({ eventTitle, price, onSuccess, onCancel }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setProgress(0);

    // Simulate payment processing with ICP tokens
    // In a real implementation, this would integrate with ICP ledger
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate payment processing delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Simulate successful payment (90% success rate for demo)
      const success = Math.random() > 0.1;
      
      if (success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setPaymentStatus('failed');
        setIsProcessing(false);
      }
    }, 2500);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay with ICP tokens to register for this event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Event Details */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Event</span>
              <span className="font-medium text-right max-w-[60%] truncate">{eventTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium flex items-center gap-1">
                <Coins className="h-4 w-4" />
                {price} ICP
              </span>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'idle' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Coins className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Click the button below to process your payment securely using ICP tokens.
              </p>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="space-y-4 py-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium mb-2">Processing Payment...</p>
                <p className="text-sm text-muted-foreground">
                  Please wait while we confirm your transaction on the ICP blockchain.
                </p>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-medium mb-2 text-green-600 dark:text-green-400">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">
                Your registration is being processed...
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="font-medium mb-2 text-red-600 dark:text-red-400">Payment Failed</p>
              <p className="text-sm text-muted-foreground">
                There was an issue processing your payment. Please try again.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {paymentStatus === 'idle' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Pay {price} ICP
                </Button>
              </>
            )}
            {paymentStatus === 'failed' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handlePayment}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
