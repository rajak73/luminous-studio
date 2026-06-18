import { useState } from 'react';
import { FiCheck, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './ServiceCard.css';

const defaultImages = {
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
  birthday: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800',
  corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
  portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800',
  other: 'https://images.unsplash.com/photo-1452587925148-ce544e77e60d?q=80&w=800'
};

const formatPrice = (price) =>
  '₹' + price.toLocaleString('en-IN');

const ServiceCard = ({ service }) => {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i._id === service._id);
  const cardImg = service.imageUrl || defaultImages[service.category] || defaultImages.other;

  return (
    <div className={`service-card ${service.popular ? 'service-card--popular' : ''}`}>
      <div className="service-card__image-wrap">
        <img src={cardImg} alt={service.name} className="service-card__image" />
        {service.popular && (
          <div className="service-card__badge">
            <FiStar size={11} /> Most Popular
          </div>
        )}
        <span className="service-card__cat-badge">{service.category}</span>
      </div>

      <div className="service-card__body">
        <div className="service-card__header">
          <h3 className="service-card__name" title={service.name}>{service.name}</h3>
          <span className="service-card__price-val">{formatPrice(service.price)}</span>
        </div>

        <p className="service-card__desc">{service.description}</p>

        {service.features && service.features.length > 0 && (
          <div className="service-card__features-wrap">
            <span className="service-card__features-label">Deliverables:</span>
            <ul className="service-card__features">
              {service.features.map((f, i) => (
                <li key={i} className="service-card__feature">
                  <FiCheck className="service-card__check" size={13} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} btn-full service-card__cta`}
          onClick={() => addItem(service)}
          disabled={inCart}
          id={`add-to-cart-${service._id}`}
        >
          <FiShoppingCart size={15} />
          {inCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
