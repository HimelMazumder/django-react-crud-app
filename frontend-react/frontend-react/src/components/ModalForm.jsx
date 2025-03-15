import { useEffect, useState } from "react";

export default function ModalForm({ isOpen, onClose, mode, onSubmit, item }) {
  if (!isOpen) {
    return null;
  }

  const [date, setDate] = useState("");
  const [tradeCode, setTradeCode] = useState("");
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");
  const [volume, setVolume] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const inputData = {
        date,
        trade_code: tradeCode,
        high,
        low,
        open,
        close,
        volume,
      };

      await onSubmit(inputData);
    } catch (err) {
      console.error("Error:", err.message);
    }

    onClose();
  };

  useEffect(() => {
    if (mode === "edit" && item) {
      setDate(item.date);
      setTradeCode(item.trade_code);
      setHigh(item.high);
      setLow(item.low);
      setOpen(item.open);
      setClose(item.close);
      setVolume(item.volume);
    } else {
      setDate("");
      setTradeCode("");
      setHigh("");
      setLow("");
      setOpen("");
      setClose("");
      setVolume("");
    }
  }, [mode, item]);

  return (
    <>
      <dialog id="modal_form" className="modal" open={isOpen}>
        <div className="modal-box">
          <h3 className="font-bold text-xl py-4">
            {mode === "edit" ? "Edit Data" : "Add Data"}
          </h3>
          <hr className="opacity-20" />

          <form method="dialog" className="mt-3" onSubmit={handleSubmit}>
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="text-center">
              <label className="input mb-4">
                <span className="label">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>

              <label className="input mb-4">
                <span className="label">Trade Code</span>
                <input
                  type="text"
                  placeholder="1JANATAMF"
                  value={tradeCode}
                  onChange={(e) => setTradeCode(e.target.value)}
                  required
                />
              </label>

              <label className="input mb-4">
                <span className="label">High</span>
                <input
                  type="number"
                  step={0.5}
                  value={high}
                  onChange={(e) => setHigh(e.target.value)}
                  required
                />
              </label>

              <label className="input mb-4">
                <span className="label">Low</span>
                <input
                  type="number"
                  step={0.5}
                  value={low}
                  onChange={(e) => setLow(e.target.value)}
                  required
                />
              </label>

              <label className="input mb-4">
                <span className="label">Open</span>
                <input
                  type="number"
                  step={0.5}
                  value={open}
                  onChange={(e) => setOpen(e.target.value)}
                  required
                />
              </label>

              <label className="input mb-4">
                <span className="label">Close</span>
                <input
                  type="number"
                  step={0.5}
                  value={close}
                  onChange={(e) => setClose(e.target.value)}
                  required
                />
              </label>

              <label className="input mb-4">
                <span className="label">Volume</span>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  required
                />
              </label>
            </div>

            <hr className="opacity-20 mt-1" />

            <button
              className={`btn btn-soft btn-${
                mode === "add" ? "primary" : "accent"
              } mt-4 float-right`}
            >
              {mode === "edit" ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
