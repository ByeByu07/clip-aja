"use client"

import { CreditCard, CreditCardBack, CreditCardExpiry, CreditCardMagStripe, CreditCardName, CreditCardNumber, CreditCardCvv } from "@/components/ui/shadcn-io/credit-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
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

const dummyBank = {
  name: "John Doe",
  account: "1234567890",
  bank: "BCA",
}

const dummyEWallet = {
  name: "John Doe",
  account: "1234567890",
  bank: "Gopay",
}

interface Payout {
  name: string;
  account: string;
  bank: string;
}


export default function Page() {

  const [payoutMethod, setPayoutMethod] = useState("option-one")
  const [bank, setBank] = useState<Payout | null>(dummyBank)
  const [ewallet, setEWallet] = useState<Payout | null>(dummyEWallet)

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
            bank ?
              <div className="flex flex-col items-start gap-5">
                <CreditCard>
                  <CreditCardBack className="bg-[#9EE672] text-black">
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
                <Dialog>
                  <DialogTrigger><Button>Edit</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Payout Method</DialogTitle>
                      <DialogDescription>
                        Edit your payout method.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" defaultValue={bank.name} placeholder="John Doe"/>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="account-1">Account</Label>
                        <Input id="account-1" name="account" defaultValue={bank.account} placeholder="1234567890"/>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="bank-1">Bank</Label>
                        <Input id="bank-1" name="bank" defaultValue={bank.bank} placeholder="BCA" />
                      </div>
                    </div>
                    <DialogFooter>
                      {/* <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose> */}
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              :
              <CreditCard>
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

          {payoutMethod === "option-two" && (
            ewallet ?
              <div className="flex flex-col items-start gap-5">
                <CreditCard>
                  <CreditCardBack className="bg-blue-500 text-white">
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
                <Dialog>
                  <DialogTrigger><Button>Edit</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Payout Method</DialogTitle>
                      <DialogDescription>
                        Edit your payout method.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" placeholder="John Doe" defaultValue={ewallet.name} />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="account-1">Nomor Telepon</Label>
                        <Input id="account-1" name="account" placeholder="08123456789" defaultValue={ewallet.account} />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="bank-1">Provider</Label>
                        <Input placeholder="Gopay, Ovo, dll" id="bank-1" name="bank" defaultValue={ewallet.bank} />
                      </div>
                    </div>
                    <DialogFooter>
                      {/* <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose> */}
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              :
              <CreditCard>
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
        </div>

      </div>
    </>
  )
}
