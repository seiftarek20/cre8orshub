import { useState } from 'react';

const proofNumber = '201553891910';
const paymentMethods = ['InstaPay', 'Vodafone Cash', 'Bank Transfer'];

function PaymentInstructions({ courseTitle }) {
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

  const openProofWhatsapp = () => {
    const message = [
      'Hello, I have completed payment for:',
      `Course: ${courseTitle}`,
      `Payment method: ${paymentMethod}`,
      'Name:',
      'Phone:',
      'Please find the payment proof attached.',
    ].join('\n');

    window.open(`https://wa.me/${proofNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="payment-instructions">
      <section className="payment-section">
        <p className="app-card-eyebrow">Egypt Payment</p>
        <h3>InstaPay / Vodafone Cash</h3>
        <p>Phone: <strong>01002316651</strong></p>
      </section>

      <section className="payment-section">
        <p className="app-card-eyebrow">International Bank Transfer</p>
        <dl className="payment-bank-list">
          <div>
            <dt>Name</dt>
            <dd>SEIF EL DEIN TAREK MOHAMED</dd>
          </div>
          <div>
            <dt>Bank</dt>
            <dd>Banque Misr</dd>
          </div>
          <div>
            <dt>IBAN</dt>
            <dd>EG780002011801180383000005398</dd>
          </div>
        </dl>
      </section>

      <label className="payment-method-select">
        Payment method used
        <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>

      <section className="payment-section">
        <p className="app-card-eyebrow">Payment Proof WhatsApp</p>
        <p>Send proof to: <strong>+201553891910</strong></p>
      </section>

      <button className="btn btn-primary" type="button" onClick={openProofWhatsapp}>
        I Have Paid
      </button>
    </div>
  );
}

export default PaymentInstructions;
