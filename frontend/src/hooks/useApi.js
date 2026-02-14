import { useState } from "react";
import toast from "react-hot-toast";

export default function useApi(fn) {
  const [loading, setLoading] = useState(false);

  const call = async (...args) => {
    try {
      setLoading(true);
      return await fn(...args);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { call, loading };
}
