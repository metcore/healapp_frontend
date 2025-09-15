"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import VendorProvider from "./VendorProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
    );
}
