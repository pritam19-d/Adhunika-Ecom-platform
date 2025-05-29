import React, { useEffect, useRef } from 'react';
import { Modal, Form } from 'react-bootstrap';
import Loader from "./Loader";

const VerifyOTPModal = ({ show, handleClose, handleVerify, isVerifying }) => {
  const otpLength = 6;
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

  useEffect(() => {
    if (show) {
      inputRefs.current[0]?.focus();
    } else {
      inputRefs.current.forEach((ref) => {
        if (ref) ref.value = '';
      });
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Email Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Please enter the 6-digit OTP sent to your email</Form.Label>
            <div className="d-flex justify-content-around gap-2">
              {[...Array(otpLength)].map((_, idx) => (
                <Form.Control
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="text-center"
                  style={{ width: '3rem', fontSize: '1.5rem' }}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        {isVerifying ? <Loader /> : <p className="d-flex justify-content-center">Please fill out all the field to proceed further</p>}
      </Modal.Footer>
    </Modal>
  );
};

export default VerifyOTPModal;