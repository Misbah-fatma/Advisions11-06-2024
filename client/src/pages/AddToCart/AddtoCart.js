import React, { useEffect, useState } from "react";
import Navbar from "../LandingPage/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../../redux/cart/cartAction";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../LandingPage/Footer";
import logo from "../LandingPage/logo10.png"

const Cart = () => {
  const state = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const checkoutHandler = async (amount) => {
    try {
      const { data: { key } } = await axios.get("http://localhost:5000/api/getkey");
      const { data: { order } } = await axios.post("http://localhost:5000/api/checkout", { amount });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Advisions Lab",
     
        image: {logo},
        order_id: order.id,
        callback_url: "http://localhost:5000/api/paymentverification",
        prefill: {
          name: "abc abc",
          email: "abc@example.com",
          contact: "9999999999"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#121212"
        }
      };

      if (window.Razorpay) {
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        console.error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">Your Cart is Empty</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const addItem = (product) => {
    dispatch(addCart(product.product));
  };

  const removeItem = (product) => {
    dispatch(delCart(product.product));
  };

  const ShowCart = () => {
    let shipping = 30.0;
    const [total, setTotal] = useState({ total_price: 0, total_qty: 0 });

    useEffect(() => {
      if (state.length > 0) {
        let total_price = 0;
        let total_item_qty = 0;
        state.forEach(item => {
          total_price += item.product.coursePrice * item.qty;
          total_item_qty += item.qty;
        });
        setTotal({ total_price, total_qty: total_item_qty });
      }
    }, [state]);

    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
          {state.map((item) => (
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Item List</h5>
                  </div>
                  <div className="card-body">
                
                      <div key={item.product.id}>
                        <div className="row d-flex align-items-center">
                          <div className="col-lg-3 col-md-12">
                            <div className="bg-image rounded" data-mdb-ripple-color="light">
                              <img
                                src={item.product.courseThumbnail}
                                alt={item.product.courseName}
                                width={100}
                                height={75}
                              />
                            </div>
                          </div>
                          <div className="col-lg-5 col-md-6">
                            <p>
                              <strong>{item.product.courseName}</strong>
                            </p>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                              <button
                                className="btn px-3"
                                onClick={() => removeItem(item)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <p className="mx-5">{item.qty}</p>
                              <button
                                className="btn px-3"
                                onClick={() => addItem(item)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                            <p className="text-start text-md-center">
                              <strong>
                                <span className="text-muted">{item.qty}</span> x ${item.product.coursePrice}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <hr className="my-4" />
                       
                      </div>
                  
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Products ({total.total_qty})<span>${Math.round(total.total_price)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                        Shipping
                        <span>${shipping}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                        </div>
                        <span>
                          <strong>${Math.round(total.total_price + shipping)}</strong>
                        </span>
                      </li>
                    </ul>
                    <button className="btn btn-dark btn-lg btn-block" onClick={() => checkoutHandler(item.product.coursePrice)}>
                     Buy Now
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
              ))}
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        {state && state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
