import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl p-8 md:p-12 text-center max-w-md w-full border border-slate-100"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100"
          >
            <ShieldAlert className="w-10 h-10 text-slate-800" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-slate-800 mb-3"
        >
          Not Authorized
        </motion.h1>

        <p className="text-slate-600 mb-8">
          Only <span className="font-semibold text-slate-800">system administrators</span> can access this page.
          Other users are not permitted to view it.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotAuthorized;
