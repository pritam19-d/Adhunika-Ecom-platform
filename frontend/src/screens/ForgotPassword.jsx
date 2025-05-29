import React, { useRef, useState } from "react";
import Meta from "../components/Meta";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useSendOtpMutation, useVerifyOtpMutation } from "../slicers/usersApiSlice";

const ForgotPassword = () => {
  const otpLength = 6;
	const [email, setEmail] = useState("");
	const [sentOtp, setSentOtp] = useState(false);
  const [isverified, setIsVerified] = useState(false);

	const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
	const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const navigate = useNavigate();

  const inputRefs = useRef([]);
  
    const handleChange = (e, index) => {
      const value = e.target.value.replace(/\D/, ''); // Remove non-digits
      if (!value) return;
  
      inputRefs.current[index].value = value;
  
      // Auto-focus next box
      if (index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
  
      const currentOTP = inputRefs.current.map((ref) => ref?.value || '').join('');
      if (currentOTP.match(/^\d{6}$/)) {
        handleVerify(currentOTP);
      }
    };
  
    const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handleVerify = async (otp) => {
      try {
        if (!otp || otp.length !== 6) {
          toast.error("Please enter a valid 6-digit OTP");
          return;
        }
        const res = await verifyOtp({ email, otp, reqType: "resetPassword" }).unwrap();
        if (res.success) {
          setIsVerified(true);
          res?.data?.email && setEmail(res.data.email);
          navigate("/login");
          toast.success("Email verified successfully!\nPlease check your email for the new password.");
        } else {
          toast.error(res.data.message || "OTP verification failed");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || "Failed to verify OTP");
      }
    }

	return (
		<Card>
			<Meta title={"Adhunika | Forgot Password"} />
			<FormContainer>
				<h1>Forgot password</h1>
				<h5>Verify your email id to get a new password</h5>
				<Form onSubmit={handleVerify}>
					<Form.Group controlId="email" className="my-3">
						<Form.Label>Email Address</Form.Label>
						<Form.Control
              type="email"
              placeholder="Enter your email address"
              value={email}
              required
              onChange={(e) => !isverified && setEmail(e.target.value)}
              readOnly={isverified}
            />
					</Form.Group>
          <Form.Group>
            <Form.Label>
              Please enter the 6-digit OTP sent to your email
            </Form.Label>
            <div className="d-flex justify-content-around gap-2">
              {[...Array(otpLength)].map((_, idx) => (
                <Form.Control
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="text-center"
                  style={{ width: "3rem", fontSize: "1.5rem" }}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  disabled={!sentOtp || isverified}
                />
              ))}
            </div>
          </Form.Group>
					{sentOtp ? (
						<Button
							type="submit"
							variant="dark"
							className="mt-2"
							disabled={isLoading}
              onClick={async (e) => {handleVerify(inputRefs.current.map(ref => ref.value).join(''))}}
						>
							Submit
						</Button>
					) : (
						<Button
							className="btn btn-outline-dark border-bottom mt-2"
							onClick={async () => {
								if (!email) {
									toast.error("Please enter your email address to verify");
									return;
								}
								try {
									const res = await sendOtp({
										email,
										reqType: "resetPassword",
									}).unwrap();
									if (res.success) {
										toast.success(res.message);
                    setSentOtp(true);
									}
								} catch (err) {
									toast.error(err?.data?.message || err.message || "Failed to send OTP");
								}
							}}
							disabled={ !email || !email.includes("@") || !email.includes(".") || isverified ||sendingOtp}
						>
							<b>Verify</b>
						</Button>
					)}
					{(isLoading || sendingOtp) && <Loader />}
				</Form>
				<Row className="py-3">
					<Col>
						Remember your password?{" "}
						<Link to={"/login"}>
							Login here
						</Link>
					</Col>
				</Row>
			</FormContainer>
		</Card>
	)
}

export default ForgotPassword;
