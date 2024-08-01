
import { createBrowserRouter, } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/menu/Menu"
import Signup from "../components/Signup"
import UpdateProfile from "../pages/dashboard/UpdateProfile"
import CartSummary from "../pages/menu/CartSummary"
import ProductDetails from "../pages/menu/ProductDetails"
import Checkout from "../pages/menu/Checkout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/menu",
        element: <Menu />
      },
      {
        path: "/menu/:id",
        element: <ProductDetails/>
      },
      {
        path: "/update-profile",
        element: <UpdateProfile />
      },
      {
        path: "/cart-page",
        element: <CartSummary />
      },
      {
        path: "/checkout",
        element: <Checkout />
      }
    ],
  },
  {
    path: "/signup",
    element: <Signup />
  }
]);

export default router