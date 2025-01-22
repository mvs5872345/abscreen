import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import '../assets/fonts.css'; // Make sure fonts.css is being imported

interface Item {
  id: string;
  name: string;
  value: string;
}

interface WebSocketMessage {
  action: string;
  item?: Record<string, Record<string, string>>;
}

const ItemGrid = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://absocket-gm2g.onrender.com/ws");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
    
      if (data.action === "update_items" && data.item) {
        let newItems: Item[] = Object.entries(data.item).map(([key, value]) => {
          const [innerKey, innerValue] = Object.entries(value)[0];
          // Format the value using Intl.NumberFormat
          const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
          }).format(Number(innerValue));
          return { id: key, name: innerKey, value: formattedValue };
        });
    
        if (items.length === 0) {
          newItems = newItems.reverse();
        }
    
        setItems((prevItems) => {
          const combinedItems = [...newItems, ...prevItems];
          const uniqueItems = Array.from(
            new Map(combinedItems.map((item) => [item.id, item])).values()
          );
          return uniqueItems.slice(0, 12);
        });
      } else {
        console.error("No item data received.");
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
  }, []);

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
        {items.length > 0 ? (
          <motion.div
            key="items-grid"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.1, ease: ["easeIn", "easeOut"] },
            }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.1, ease: ["easeIn", "easeOut"] }}
            className={`grid gap-4 p-4 absolute inset-0 ${getGridColumns(items.length)}`}
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 1, y: 2, scale: 0.7 }}
                animate={{
                  opacity: 1,
                  scale: [0.9, 0.8, 0.9],
                  transition: {
                    duration: 10.0,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                }}
                exit={{ opacity: 1, y: -50, scale: 0.8 }}
                transition={{ duration: 4.0, ease: "easeInOut" }}
                className="p-4 border border-gray-400 rounded flex flex-col justify-center items-center bg-white shadow-md"
              >
                <h3 className="font-ha-yetzira text-4xl">{item.name}</h3> {/* Increased text size */}
                <p className="font-franknatan text-3xl text-gray-600">{item.value}</p> {/* Increased text size */}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-2xl">No items available</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemGrid;
