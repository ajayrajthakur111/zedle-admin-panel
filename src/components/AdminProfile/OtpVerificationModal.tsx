import { useState, useEffect, type FC,type ChangeEvent } from "react"
import { ModalWrapper } from "./ModalWrapper"
import Button from "../ui/Button"
import { verifyOtp } from "@/api/authService"

interface OtpVerificationModalProps {
  isOpen: boolean
  phone: string
  onClose: () => void
  onBack: () => void
  onVerified: () => void
}

export const OtpVerificationModal: FC<OtpVerificationModalProps> = ({
  isOpen,
  phone,
  onClose,
  onBack,
  onVerified,
}) => {
  const length = 6
  const [otpVals, setOtpVals] = useState<string[]>(Array(length).fill(""))
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputsRef = Array<HTMLInputElement | null>(length).fill(null)

  // reset on open
  useEffect(() => {
    if (isOpen) {
      setOtpVals(Array(length).fill(""))
      setTimer(30)
      setCanResend(false)
    }
  }, [isOpen])

  // countdown
  useEffect(() => {
    if (!isOpen) return
    if (timer > 0) {
      const id = setTimeout(() => setTimer(t => t - 1), 1000)
      return () => clearTimeout(id)
    }
    setCanResend(true)
  }, [timer, isOpen])

  const handleResend = () => {
    if (!canResend) return
    setTimer(30)
    setCanResend(false)
    console.log("Dummy resend OTP")
  }

  const handleOtpChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, "")
    if (!digit) return
    const next = [...otpVals]
    next[idx] = digit
    setOtpVals(next)
    if (idx < length - 1) inputsRef[idx + 1]?.focus()
  }

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otpVals[idx] && idx > 0) {
      inputsRef[idx - 1]?.focus()
      const next = [...otpVals]
      next[idx - 1] = ""
      setOtpVals(next)
    }
  }

  const submitOtp = async () => {
    const code = otpVals.join("")
    if (code.length < length) return
    setIsVerifying(true)
    try {
      const { message } = await verifyOtp(code)
      console.log(message)
      onVerified()
    } catch (err) {
      console.error(err)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      title="OTP Verification"
      showBack
      onClose={onClose}
      onBack={onBack}
      maxW="max-w-md"
    >
      <div className="bg-[#8e1380] rounded-2xl p-4 pb-8">
        <p className="text-white/80 mb-4">
          Enter the 6-digit code sent to <strong>{phone}</strong>
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {otpVals.map((v, i) => (
            <input
              key={i}
              ref={el => { inputsRef[i] = el }}
              type="text"
              maxLength={1}
              value={v}
              inputMode="numeric"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleOtpChange(e.target.value, i)
              }
              onKeyDown={e => handleKey(e, i)}
              className="w-10 h-12 sm:w-12 sm:h-14 bg-white/10 text-white text-xl font-semibold rounded focus:ring-1 focus:ring-white/60 text-center"
            />
          ))}
        </div>
        <div className="flex justify-between items-center px-4 mb-4">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`text-sm underline ${
              canResend ? "text-white" : "text-white/50 cursor-not-allowed"
            }`}
          >
            Re-send Code {!canResend && `(${timer}s)`}
          </button>
          <Button onClick={submitOtp} disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}
