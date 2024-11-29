import React, { useEffect, useRef } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

interface Step {
  id: string;
  title?: string;
  text: string;
  attachTo?: {
    element: string;
    on: string;
  };
}

interface TourProps {
  steps: Step[];
  isOpen: boolean;
  onClose: () => void;
}

const AppTour: React.FC<TourProps> = ({ steps, isOpen, onClose }) => {
  const tour = useRef<any>(null);

  useEffect(() => {
    if (!tour.current) {
      // Initialize Shepherd tour
      tour.current = new Shepherd.Tour({
        defaultStepOptions: {
          scrollTo: true,
          cancelIcon: {
            enabled: true,
          },
          classes: "custom-tour-modal"
        },
        useModalOverlay: true,
      });

      // Add steps to the tour
      steps.forEach((step, index) => {
        tour.current?.addStep({
          id: step.id,
          title: step.title,
          text: step.text,
          attachTo: step.attachTo,
          buttons: [
            ...(index > 0
              ? [
                  {
                    text: 'Previous',
                    action: tour.current?.back,
                  },
                ]
              : []),
            ...(index < steps.length - 1
              ? [
                  {
                    text: 'Next',
                    action: tour.current?.next,
                  },
                ]
              : []),
            ...(index === steps.length - 1
              ? [
                  {
                    text: 'Done',
                    action: tour.current?.next,
                  },
                ]
              : []),
          ],
        });
      });
    }

    if (isOpen) {
      // Start the tour when `isOpen` is true
      tour.current.start();
    } else {
      // Cancel the tour when `isOpen` is false
      tour.current?.cancel();
    }

    return () => {
      // Cleanup: cancel the tour on component unmount
      tour.current?.cancel();
    };
  }, [isOpen, steps]);

  return null;
};

export default AppTour;
