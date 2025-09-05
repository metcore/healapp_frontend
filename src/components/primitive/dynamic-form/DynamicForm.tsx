import Input from "../primitive/input/Input";
import Button from "react-bootstrap/Button";

export default function DynamicForm({ items, onChange, onAdd, onRemove, label }) {
  return (
    <div className="row gy-3">
      {items.map((item, idx) => (
        <div className="col-12 d-flex align-items-center gap-2" key={idx}>
          <Input
            label={`${label} ${idx + 1}`}
            placeholder="Mis: warna kuning, size xl"
            value={item.name}
            onChange={(e) => onChange(idx, e.target.value)}
          />
          <Button
            variant="danger"
            onClick={() => onRemove(idx)}
            disabled={items.length === 1}
          >
            Hapus
          </Button>
        </div>
      ))}
      <div className="col-12">
        <Button variant="primary" className="mt-3 btn-block" onClick={onAdd}>
          Tambah {label}
        </Button>
      </div>
    </div>
  );
}