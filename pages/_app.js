import React from 'react';
import ReactGA from "react-ga4";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";

// import loader from "../src/components/splashLoader/loader";

import 'bootstrap/dist/css/bootstrap.min.css';
import "react-image-gallery/styles/css/image-gallery.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import '../styles/globals.css'
import {handleLoadingComplete} from "@/helpers/loader";

const queryClient = new QueryClient();

ReactGA.initialize("G-X8391HTZ4L");

function App({ Component, pageProps }) {

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const loader = document.getElementById('globalLoader');
    //         const logo = document.getElementById('logo');
    //         if (loader) {
    //             // loader.style.display = 'none';
    //             loader.classList.add('hidden');
    //         }
    //         if (logo) {
    //             logo.classList.add('loaded-content');
    //             logo.classList.add('fullscreen');
    //         }
    //     }
    // }, []);

    if (typeof window !== 'undefined') {
        handleLoadingComplete();
    }

    return (
        <QueryClientProvider client={ queryClient }>
            <Component {...pageProps} />
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}

export default App
