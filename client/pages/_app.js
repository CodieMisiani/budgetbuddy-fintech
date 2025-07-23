import "../src/styles/globals.css";
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { AuthProvider } from '../src/context/AuthContext'

function MyApp({ Component, pageProps }) {
  return _jsx(AuthProvider, {
    children: _jsx(Component, { ...pageProps })
  })
}

export default MyApp

