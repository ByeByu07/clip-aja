"use client"

import { CreditCard, CreditCardBack, CreditCardExpiry, CreditCardMagStripe, CreditCardName, CreditCardNumber, CreditCardCvv } from "@/components/ui/shadcn-io/credit-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

interface Payout {
  name: string;
  account: string;
  bank: string;
}

export default function Page() {

  const [payoutMethod, setPayoutMethod] = useState("option-one")
  const [bank, setBank] = useState<Payout | null>(null)
  const [ewallet, setEWallet] = useState<Payout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const [isEwalletDialogOpen, setIsEwalletDialogOpen] = useState(false)

  // Fetch existing payment methods on mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('/api/payment-methods')
        if (response.ok) {
          const result = await response.json()
          if (result.data.bankTransfer) {
            setBank({
              name: result.data.bankTransfer.accountHolderName,
              account: result.data.bankTransfer.accountNumber,
              bank: result.data.bankTransfer.bankName
            })
          }
          if (result.data.ewallet) {
            setEWallet({
              name: result.data.ewallet.accountHolderName,
              account: result.data.ewallet.walletPhoneNumber,
              bank: result.data.ewallet.walletProvider
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPaymentMethods()
  }, [])

  // Bank Transfer Form
  const bankForm = useForm({
    defaultValues: {
      name: bank?.name || '',
      account: bank?.account || '',
      bank: bank?.bank || ''
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch('/api/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'bank_transfer',
            name: value.name,
            account: value.account,
            bank: value.bank
          })
        })

        if (response.ok) {
          const result = await response.json()
          setBank({ name: value.name, account: value.account, bank: value.bank })
          setIsBankDialogOpen(false)
          toast.success('Bank transfer details saved successfully')
        } else {
          const error = await response.json()
          toast.error(error.message || 'Failed to save bank details')
        }
      } catch (error) {
        toast.error('Network error occurred')
        console.error('Bank form error:', error)
      }
    }
  })

  // E-Wallet Form
  const ewalletForm = useForm({
    defaultValues: {
      name: ewallet?.name || '',
      account: ewallet?.account || '',
      bank: ewallet?.bank || ''
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch('/api/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ewallet',
            name: value.name,
            account: value.account,
            provider: value.bank
          })
        })

        if (response.ok) {
          const result = await response.json()
          setEWallet({ name: value.name, account: value.account, bank: value.bank })
          setIsEwalletDialogOpen(false)
          toast.success('E-wallet details saved successfully')
        } else {
          const error = await response.json()
          toast.error(error.message || 'Failed to save e-wallet details')
        }
      } catch (error) {
        toast.error('Network error occurred')
        console.error('E-wallet form error:', error)
      }
    }
  })

  // Update form values when bank/ewallet state changes
  useEffect(() => {
    if (bank) {
      bankForm.setFieldValue('name', bank.name)
      bankForm.setFieldValue('account', bank.account)
      bankForm.setFieldValue('bank', bank.bank)
    }
  }, [bank])

  useEffect(() => {
    if (ewallet) {
      ewalletForm.setFieldValue('name', ewallet.name)
      ewalletForm.setFieldValue('account', ewallet.account)
      ewalletForm.setFieldValue('bank', ewallet.bank)
    }
  }, [ewallet])

  if (isLoading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Loading payment methods...</p>
      </div>
    )
  }

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2 px-4">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <p className="text-2xl font-semibold">Payouts</p>
          <p className="text-muted-foreground">Payouts are the payments you receive for your posts.</p>
          <RadioGroup value={payoutMethod} onValueChange={setPayoutMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Bank Transfer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">E-Wallet</Label>
            </div>
          </RadioGroup>
          {payoutMethod === "option-one" && (
            <>
              {bank ? (
                <div className="flex flex-col items-start gap-5">
                  <CreditCard>
                    <CreditCardBack className="bg-blue-500 text-white">
                      <CreditCardMagStripe />
                      <CreditCardNumber className="absolute bottom-0 left-0">
                        {bank.account}
                      </CreditCardNumber>
                      <div className="absolute @xs:bottom-12 bottom-8 flex w-full @xs:flex-row flex-col @xs:justify-between gap-4 uppercase">
                        <CreditCardName className="flex-1">{bank.name}</CreditCardName>
                        <CreditCardCvv>{bank.bank}</CreditCardCvv>
                      </div>
                    </CreditCardBack>
                  </CreditCard>
                  <Button onClick={() => setIsBankDialogOpen(true)}>Edit</Button>
                </div>
              ) : (
                <CreditCard onClick={() => setIsBankDialogOpen(true)}>
                  <CreditCardBack className="bg-blue-500 text-white cursor-pointer hover:rotate-2 transition-all duration-300 ease-in-out">
                    <CreditCardMagStripe />
                    <CreditCardNumber className="absolute bottom-0 left-0">
                    </CreditCardNumber>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Plus className="size-5" />
                      <p className="text-center uppercase">Add Payout Method</p>
                    </div>
                  </CreditCardBack>
                </CreditCard>
              )}

              <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Payout Method</DialogTitle>
                      <DialogDescription>
                        Edit your bank transfer payout method.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        bankForm.handleSubmit()
                      }}
                    >
                      <div className="grid gap-4">
                        <bankForm.Field
                          name="name"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Name is required' : undefined
                          }}
                        >
                          {(field) => (
                            <div className="grid gap-3">
                              <Label htmlFor="name-1">Name</Label>
                              <Input
                                id="name-1"
                                name="name"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="John Doe"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                              )}
                            </div>
                          )}
                        </bankForm.Field>
                        <bankForm.Field
                          name="account"
                          validators={{
                            onChange: ({ value }) =>
                              !value
                                ? 'Account number is required'
                                : value.length < 8
                                  ? 'Account number must be at least 8 characters'
                                  : undefined
                          }}
                        >
                          {(field) => (
                            <div className="grid gap-3">
                              <Label htmlFor="account-1">Account Number</Label>
                              <Input
                                id="account-1"
                                name="account"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="1234567890"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                              )}
                            </div>
                          )}
                        </bankForm.Field>
                        <bankForm.Field
                          name="bank"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Bank name is required' : undefined
                          }}
                        >
                          {(field) => (
                            <div className="grid gap-3">
                              <Label htmlFor="bank-1">Bank Name</Label>
                              <Input
                                id="bank-1"
                                name="bank"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="BCA"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                              )}
                            </div>
                          )}
                        </bankForm.Field>
                      </div>
                      <DialogFooter className="mt-4">
                        <bankForm.Subscribe
                          selector={(state) => [state.canSubmit, state.isSubmitting]}
                        >
                          {([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit || isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                'Save'
                              )}
                            </Button>
                          )}
                        </bankForm.Subscribe>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            </>
          )}

          {payoutMethod === "option-two" && (
            <>
              {ewallet ? (
                <div className="flex flex-col items-start gap-5">
                  <CreditCard>
                    <CreditCardBack className="bg-green-500 text-white">
                      <CreditCardMagStripe />
                      <CreditCardNumber className="absolute bottom-0 left-0">
                        {ewallet.account}
                      </CreditCardNumber>
                      <div className="absolute @xs:bottom-12 bottom-8 flex w-full @xs:flex-row flex-col @xs:justify-between gap-4 uppercase">
                        <CreditCardName className="flex-1">{ewallet.name}</CreditCardName>
                        <CreditCardCvv>{ewallet.bank}</CreditCardCvv>
                      </div>
                    </CreditCardBack>
                  </CreditCard>
                  <Button onClick={() => setIsEwalletDialogOpen(true)}>Edit</Button>
                </div>
              ) : (
                <CreditCard onClick={() => setIsEwalletDialogOpen(true)}>
                  <CreditCardBack className="bg-green-500 text-white cursor-pointer hover:rotate-2 transition-all duration-300 ease-in-out">
                    <CreditCardMagStripe />
                    <CreditCardNumber className="absolute bottom-0 left-0">
                    </CreditCardNumber>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Plus className="size-5" />
                      <p className="text-center uppercase">Add Payout Method</p>
                    </div>
                  </CreditCardBack>
                </CreditCard>
              )}

              <Dialog open={isEwalletDialogOpen} onOpenChange={setIsEwalletDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Payout Method</DialogTitle>
                      <DialogDescription>
                        Edit your e-wallet payout method.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        ewalletForm.handleSubmit()
                      }}
                    >
                      <div className="grid gap-4">
                        <ewalletForm.Field
                          name="name"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Name is required' : undefined
                          }}
                        >
                          {(field) => (
                            <div className="grid gap-3">
                              <Label htmlFor="name-2">Name</Label>
                              <Input
                                id="name-2"
                                name="name"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="John Doe"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                              )}
                            </div>
                          )}
                        </ewalletForm.Field>
                        <ewalletForm.Field
                          name="account"
                          validators={{
                            onChange: ({ value }) =>
                              !value
                                ? 'Phone number is required'
                                : value.length < 10
                                  ? 'Phone number must be at least 10 characters'
                                  : undefined
                          }}
                        >
                          {(field) => (
                            <div className="grid gap-3">
                              <Label htmlFor="account-2">Nomor Telepon</Label>
                              <Input
                                id="account-2"
                                name="account"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="08123456789"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                              )}
                            </div>
                          )}
                        </ewalletForm.Field>
                        <ewalletForm.Field
                          name="bank"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Provider is required' : undefined
                          }}
                        >
                          {(field) => (
                            <div className="grid gap-3">
                              <Label htmlFor="bank-2">Provider</Label>
                              <Input
                                id="bank-2"
                                name="bank"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Gopay, Ovo, dll"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                              )}
                            </div>
                          )}
                        </ewalletForm.Field>
                      </div>
                      <DialogFooter className="mt-4">
                        <ewalletForm.Subscribe
                          selector={(state) => [state.canSubmit, state.isSubmitting]}
                        >
                          {([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit || isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                'Save'
                              )}
                            </Button>
                          )}
                        </ewalletForm.Subscribe>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            </>
          )}
        </div>

      </div>
    </>
  )
}
