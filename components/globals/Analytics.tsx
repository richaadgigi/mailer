'use client'

import React, { useEffect } from 'react';
import Clarity from "@microsoft/clarity";
import ReactGA from "react-ga4";

const projectId = "pfk6jtbr19";

const Analytics = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Initialize Microsoft Clarity
            Clarity.init(projectId);
      
            // Initialize Google Analytics
            ReactGA.initialize("G-LREWL0CHFH");
        }
    }, []);
    return (
        <></>
    );
};

export default Analytics;