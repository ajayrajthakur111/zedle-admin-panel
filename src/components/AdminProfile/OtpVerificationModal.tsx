import { useState, useEffect, type FC, } from "react"
import { ModalWrapper } from "./ModalWrapper"
import { verifyOtp } from "@/api/authService"
import { useAdminStore, type AdminProfile } from "@/store/adminStore"

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
const profile = useAdminStore((state) => state.profile);

  const { avatarUrl } = profile as AdminProfile;
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
      avatarUrl={avatarUrl}
    >
       <div
      className="font-['Inter'] text-white rounded-2xl shadow-xl m-2"
      style={{
        background: '#45103F30',
        padding: '48px 32px', // Equivalent to py-12 px-8
      }}
    >
      {/* Top Information Text */}
      <div className="mb-8 text-left">
        <p className="text-lg leading-tight ">
          A 6 digit OTP code has been sent to{' '}
          <strong className="font-semibold text-white">{phone}</strong>
        </p>
        <p className="text-sm leading-tight mt-1.5">
          enter the code to continue..
        </p>
      </div>

      {/* Verification Code Label */}
      <p className="text-base font-medium text-white mb-3 text-left">
        Verification Code
      </p>

      {/* OTP Input Fields */}
      <div className="flex justify-center gap-x-2 mb-6">
        {otpVals.map((v, i) => (
          <input
            key={i}
            ref={el => { inputsRef[i] = el; }}
            type="text"
            maxLength={1}
            value={v}
            inputMode="numeric"
            onChange={(e) => handleOtpChange(e.target.value, i)}
            onKeyDown={e => handleKey(e, i)}
            className="w-12 h-14 bg-[#EEC4F23B] text-white text-2xl font-semibold rounded-lg text-center focus:ring-1 focus:ring-white/60 outline-none transition-all duration-150 ease-in-out"
          />
        ))}
      </div>

      {/* Re-send Code Link */}
      <div className="text-right mb-10">
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`text-[13px] underline transition-opacity duration-150 ease-in-out ${
            canResend ? "text-white hover:text-white/80" : "text-white/50 cursor-not-allowed"
          }`}
        >
          Re-send Code {!canResend && `(${timer}s)`}
        </button>
      </div>

      {/* SIGN UP Button */}
      <button
        onClick={submitOtp}
        disabled={isVerifying}
        className="w-full text-white text-sm font-bold py-4 rounded-lg uppercase tracking-wider transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(90deg, #510052 0%, #800A5C 100%)',
        }}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>
    </div>
    </ModalWrapper>
  )
}
