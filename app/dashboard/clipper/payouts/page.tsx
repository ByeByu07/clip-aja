"use client"

import { CreditCard, CreditCardBack, CreditCardExpiry, CreditCardMagStripe, CreditCardName, CreditCardNumber, CreditCardCvv } from "@/components/ui/shadcn-io/credit-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function Page() {

  const [payoutMethod, setPayoutMethod] = useState("option-one")

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
            <CreditCard>
            <CreditCardBack className="bg-[#9EE672] text-black">
              <CreditCardMagStripe />
              <CreditCardNumber className="absolute bottom-0 left-0">
                0123 4567 8901 2345
              </CreditCardNumber>
              <div className="absolute @xs:bottom-12 bottom-8 flex w-full @xs:flex-row flex-col @xs:justify-between gap-4">
                <CreditCardName className="flex-1">John R. Doe</CreditCardName>
                <div className="flex flex-1 @xs:justify-between gap-4">
                  <CreditCardExpiry>**/**</CreditCardExpiry>
                  <CreditCardCvv>***</CreditCardCvv>
                </div>
              </div>
            </CreditCardBack>
          </CreditCard>
          )}

          {payoutMethod === "option-two" && (
            <CreditCard>
            <CreditCardBack className="bg-blue-500 text-white">
              <CreditCardMagStripe />
              <CreditCardNumber className="absolute bottom-0 left-0">
                085701910867
              </CreditCardNumber>
              <div className="absolute @xs:bottom-12 bottom-8 flex w-full @xs:flex-row flex-col @xs:justify-between gap-4">
                <CreditCardName className="flex-1">John R. Doe</CreditCardName>
              </div>
            </CreditCardBack>
          </CreditCard>
          )}
        </div>
      </div>
    </>
  )
}
