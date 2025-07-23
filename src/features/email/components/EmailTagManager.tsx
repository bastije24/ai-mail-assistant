import React from 'react';

interface EmailTagManagerProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const EmailTagManager: React.FC<EmailTagManagerProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onAddTag(event.currentTarget.value);
      event.currentTarget.value = '';
    }
  };

  return (
    <div>
      <h3>Tags:</h3>
      <div>
        {tags.map((tag) => (
          <span key={tag}>
            {tag}
            <button onClick={() => onRemoveTag(tag)}>Remove</button>
          </span>
        ))}
      </div>
      <input type="text" placeholder="Add tag" onKeyDown={handleAddTag} />
    </div>
  );
};

export { EmailTagManager };
