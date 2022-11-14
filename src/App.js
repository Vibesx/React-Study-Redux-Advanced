import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { sendCartData, fetchCartData } from "./store/cart-actions";
//import { uiActions } from "./store/ui-slice";

let isInitial = true;

function App() {
	const dispatch = useDispatch();
	const showCart = useSelector((state) => state.ui.cartIsVisible);
	const cart = useSelector((state) => state.cart);
	const notification = useSelector((state) => state.ui.notification);

	useEffect(() => {
		dispatch(fetchCartData());
	}, [dispatch]);

	// by adding cart as a dependency, we will trigger useEffect on every item added/removed from cart, thus sending a PUT request to update the cart in the DB
	useEffect(() => {
		// const sendCartData = async () => {
		// 	// handling these in cart-slice.js
		// 	dispatch(
		// 		uiActions.showNotification({
		// 			status: "pending",
		// 			title: "Sending...",
		// 			message: "Sending cart data!",
		// 		})
		// 	);
		// 	const response = await fetch(
		// 		"https://react-http-ac71a-default-rtdb.europe-west1.firebasedatabase.app/cart.json",
		// 		{ method: "PUT", body: JSON.stringify(cart) }
		// 	);
		// 	if (!response.ok) {
		// 		throw new Error("Sending cart data failed.");
		// 	}
		// 	dispatch(
		// 		uiActions.showNotification({
		// 			status: "success",
		// 			title: "Success...",
		// 			message: "Sent cart data successfully!",
		// 		})
		// 	);
		// };

		// prevent useEffect from running on first render (ex: page load/reload) and thus overwriting our DB data with empty data
		if (isInitial) {
			isInitial = false;
			return;
		}

		if (cart.changed) {
			dispatch(sendCartData(cart));
		}
		// sendCartData().catch((error) => {
		// 	dispatch(
		// 		uiActions.showNotification({
		// 			status: "error",
		// 			title: "Error...",
		// 			message: "Sending cart data failed!",
		// 		})
		// 	);
		// });
	}, [cart, dispatch]);

	return (
		<>
			{notification && (
				<Notification
					status={notification.status}
					title={notification.title}
					message={notification.message}
				></Notification>
			)}
			<Layout>
				{showCart && <Cart />}
				<Products />
			</Layout>
		</>
	);
}

export default App;
