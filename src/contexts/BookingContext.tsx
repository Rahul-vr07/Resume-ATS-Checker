import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  bookings: any[];
  addBooking: (booking: any) => void;
  getBooking: (id: string) => any;
  cancelBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  
  const addBooking = (booking: any) => {
    setBookings(prev => [booking, ...prev]);
  };
  
  const getBooking = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };
  
  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'cancelled' } : booking
    ));
  };
  
  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      getBooking,
      cancelBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};