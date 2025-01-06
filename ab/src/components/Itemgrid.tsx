import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface Item {
  id: string; // Unique identifier
  name: string; // Key from the nested structure
  value: string; // Value associated with the key
}

interface WebSocketMessage {
  action: string;
  item?: Record<string, Record<string, string>>; // Updated to handle a nested object

  page?: number;  // Add 'page' here as optional, as it is referenced in the WebSocket message
  
}

const ItemGrid = () => {
  const [items, setItems] = useState<Item[]>([]); // Initialize as an array
  const [page, setPage] = useState<number>(0);
  const [overridePage, setOverridePage] = useState<number | null>(null); // To handle the page override
  const controls = useAnimation();
  const currentpage = useRef(0);

  const itemsPerPage = 9;

  // Set up WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("wss://absocket-gm2g.onrender.com/ws");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);

      if (data.action === "update_items") {
        console.log("Received data:", data);

        if (data.item) {
          // Convert the nested dictionary to an array of key-value pairs
          const newItems: Item[] = Object.entries(data.item).map(([key, value]) => {
            const [innerKey, innerValue] = Object.entries(value)[0];
            return { id: key, name: innerKey, value: innerValue }; // Add `id` for uniqueness
          });

          console.log("Processed items:", newItems);

          setItems((prevItems) => {
            // Remove the placeholder item if it exists
            const filteredItems = prevItems.filter(item => item.id !== "abwelcome");

            // Create a map of existing items for quick lookup
            const existingIds = new Set(filteredItems.map((item) => item.id));

            // Filter out duplicates
            const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));

            console.log("Unique new items:", uniqueNewItems);

            // Add unique new items to the state
            return [...filteredItems, ...uniqueNewItems];
          });
        } else {
          console.error("No item data received.");
          // Add placeholder item
          setItems((prevItems) => {
            if (!prevItems.some(item => item.id === "abwelcome")) {
              return [...prevItems, { id: "abwelcome", name: "Welcome", value: "0" }];
            }
            return prevItems;
          });
        }
        if (data.page ) {
          if (currentpage.current !== data.page){
            setPage(data.page);
            console.log("Page override:", overridePage);
            setOverridePage(1);
            console.log("Page override 2:", overridePage);
            
            setTimeout(() => setOverridePage(null), 30000); // Reset override after 5 seconds
          }
          else{
            if (overridePage !== null) {
              setOverridePage(1); // Reset override if it's active
              setTimeout(() => setOverridePage(null), 10000); // Reset override after 5 seconds
            }
          }
         
          }
        

       
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
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (overridePage ?? page) * itemsPerPage,
    (overridePage ?? page + 1) * itemsPerPage
  );

  useEffect(() => {
    currentpage.current = page;
  }, [page]);

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
        {items.length > 0 ? (
          <motion.div
            key={overridePage ?? page}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.1, ease: ["easeIn", "easeOut"]},
            }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.1, ease: ["easeIn", "easeOut"] }}
            className={`grid gap-4 p-4 absolute inset-0 ${getGridColumns(
              currentItems.length
            )}`}
          >
            {currentItems.map((item) => (
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
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">Value: {item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No items available</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemGrid;
