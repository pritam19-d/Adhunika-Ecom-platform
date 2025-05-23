import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta.jsx";
import {
	useCreateOrderMutation,
	useVerifyRazorpayPaymentMutation,
} from "../slicers/orderApiSlices";
import { clearCartItems } from "../slicers/cartSlice";

const PlaceOrdersScreen = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const { userInfo } = useSelector((state) => state.auth);

	const [createOrder, { isLoading, error }] = useCreateOrderMutation();
	const [verifyRazorpayPayment, { isLoading: loadingVerification }] =
		useVerifyRazorpayPaymentMutation();

	useEffect(() => {
		if (!cart.shippingAddress.address) {
			navigate("/shipping");
		} else if (!cart.paymentMethod) {
			navigate("/payment");
		}
	}, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

	const placeOrderHandler = async (e) => {
		try {
			const res = await createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice,
			}).unwrap();

			if (cart.paymentMethod === "COD") {
				navigate(`/order/${res.data._id}`);
				dispatch(clearCartItems());
			} else if (cart.paymentMethod === "Razorpay") {
				const options = {
					key: res.key, // the Razorpay Key ID
					amount: res.data.totalPrice, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
					currency: "INR",
					name: "Adhunika Online",
					description: "Test Transaction",
					image: "https://github.com/pritam19-d/Adhunika-Ecom-platform/blob/master/frontend/public/Adhunika.png",
					order_id: res?.razorpayOrderId,
					handler: async function (response) {
						try {
							const result = await verifyRazorpayPayment({
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
								orderId: res?.data?._id, // MongoDB order ID
							}).unwrap();
							if (result.success) {
								dispatch(clearCartItems());
								navigate(`/order/${res.data._id}`);
							} else {
								toast.error("Payment verification failed.");
							}
						} catch (err) {
							console.log("Error>>>>>\n" + { err });
						}
					},
					method: {
						netbanking: true,
						card: true,
						upi: true,
						wallet: true,
					},
					prefill: {
						name: userInfo.name,
						email: userInfo.email,
						contact: userInfo.mobileNo,
					},
					notes: {
						address: "Razorpay Corporate Office",
					},
					theme: {
						color: "#7b8a8b",
					},
				};
				const rzp1 = new window.Razorpay(options);
				rzp1.on("payment.failed", function (response) {
					console.log(response.error);
          toast.error(`Error: ${response.error.description}`);
				});
				rzp1.open();
				e.preventDefault();
			}
		} catch (err) {
			console.log("Error>>>>>\n" + err);
			toast.error(err.error || err.message);
		}
	};

	return (
		<>
			<Meta title={"Adhunika | Place Order"} />
			<CheckoutSteps step1 step2 step3 step4 />
			{loadingVerification? 
      <Col>
        <Row><Loader /></Row>
        <Row><h4>Please wait while we verifying your payment</h4></Row>
      </Col> : (<Row>
				<Col md={8}>
					<ListGroup>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
								{cart.shippingAddress.district}, {cart.shippingAddress.pinCode}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{cart.paymentMethod}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your Cart Is Empty.</Message>
							) : (
								<ListGroup variant="flush">
									{cart.cartItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item._id}`}>{item.name}</Link>
												</Col>
												<Col md={4}>
													₹{item.price} × {item.qty} = ₹{item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item></ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items:</Col>
									<Col>₹{cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping:</Col>
									<Col>₹{cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax:</Col>
									<Col>₹{cart.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total:</Col>
									<Col>₹{cart.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								{error && <Message variant="danger">{error}</Message>}
							</ListGroup.Item>
							<ListGroup.Item>
								{/* <Button
									type="button"
									className="btn-dark"
									disabled={cart.cartItems.length === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button> */}
								<Button
									type="button"
									className="btn-dark"
									disabled={cart.cartItems.length === 0}
									onClick={placeOrderHandler}
								>
									{cart.paymentMethod === "Razorpay"
										? "Pay to place your order"
										: "Place Order"}
								</Button>
								{isLoading && <Loader />}
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>)}
		</>
	);
};

export default PlaceOrdersScreen;
