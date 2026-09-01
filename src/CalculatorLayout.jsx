function CalculatorLayout({ children, onBack }) {
  return (
    <div className="min-h-screen">
      {children}

      <div className="flex justify-center px-4 py-8">
        <button
          type="button"
          onClick={onBack}
          className="
            flex items-center gap-2
            rounded-xl
            bg-blue-600
            px-6 py-3
            text-sm font-semibold
            text-white
            shadow-md
            transition-all duration-200
            hover:bg-blue-700
            hover:shadow-lg
            active:scale-95
          "
        >
          <span className="text-lg">←</span>
          Back to Materials
        </button>
      </div>
    </div>
  );
}

export default CalculatorLayout;