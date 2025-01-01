import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface Items {
  [key: string]: string;
}

interface WebSocketMessage {
  action: string;
  item?: Items;
  page?: number | null;
}

const ItemGrid = () => {
  const [items, setItems] = useState<Items>({});
  const [page, setPage] = useState<number>(0);
  const [overridePage, setOverridePage] = useState<number | null>(null); // To handle the page override
  const controls = useAnimation();

  const itemsPerPage = 9;

  // Set up WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("wss://absocket.onrender.com/ws");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);

      if (data.action === "update_items" && data.item) {
        setItems((prevItems) => {
          const updatedItems = { ...prevItems, ...data.item };
          console.log("Items updated:", updatedItems);

          // Handle page override if included in the message
          if (data.page !== undefined && data.page !== null) {
            console.log("Page override received:", data.page);
            setOverridePage(data.page);
            // Automatically clear the override after 10 seconds
            setTimeout(() => {
              setOverridePage(null);
            }, 10000);
          }

          return updatedItems;
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []); // WebSocket setup runs once

  // Paginate items
  const itemArray = Object.entries(items);
  const totalPages = Math.ceil(itemArray.length / itemsPerPage);
  const currentItems = itemArray.slice(
    (overridePage ?? page) * itemsPerPage,
    (overridePage ?? page + 1) * itemsPerPage
  );

  // UseEffect for auto page change after 30 seconds
  useEffect(() => {
    if (overridePage !== null) return; // Skip automatic alternation if override is active

    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
      controls.start({
        x: [0, 10, -10, 0],
        transition: { duration: 0.5, repeat: 1, repeatType: "loop" },
      });
    }, 30000); // Update page every 30 seconds

    // Cleanup function
    return () => clearInterval(timer);
  }, [page, totalPages, overridePage, controls]);

  // Helper function to determine grid columns
  const getGridColumns = (itemCount: number): string => {
    if (itemCount === 1) return "grid-cols-1";
    if (itemCount === 2) return "grid-cols-2";
    if (itemCount === 3) return "grid-cols-3";
    if (itemCount <= 6) return "grid-cols-2";
    if (itemCount <= 12) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={overridePage ?? page}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 4.5, ease: "easeOut" },
          }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`grid gap-4 p-4 absolute inset-0 ${getGridColumns(currentItems.length)}`}
        >
          {currentItems.map(([key, value], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.8, y: 2, scale: 0.7 }}
              animate={{
                opacity: 1,
                scale: [0.9, 0.8, 0.9],
                transition: { duration: 10.0, ease: "easeInOut", repeat: Infinity, repeatType: "loop" },
              }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 4.0, ease: "easeInOut" }}
              className="p-4 border border-gray-400 rounded flex flex-col justify-center items-center bg-white shadow-md"
            >
              <h3 className="font-semibold">{key}</h3>
              <p className="text-gray-600">Value: {value}</p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ItemGrid;
