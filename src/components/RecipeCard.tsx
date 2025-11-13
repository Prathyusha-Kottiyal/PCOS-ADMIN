import React from "react";

interface RecipeCardProps {
  id: string;
  title: string;
  description?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RecipeCard({ id, title, description, onEdit, onDelete }: RecipeCardProps) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3 style={{ margin: 0, fontWeight: 'bold' }}>{title}</h3>
        {description && <p style={{ margin: '4px 0 0 0' }}>{description}</p>}
      </div>
      <div>
        <button onClick={() => onEdit(id)} style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => onDelete(id)}>Delete</button>
      </div>
    </div>
  );
}
