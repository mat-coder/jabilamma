import ContextForm from '../ContextForm';

export default function ContextFormExample() {
  return (
    <div className="space-y-8">
      <ContextForm 
        contentType="lyrics"
        onContextChange={(context) => console.log('Song context:', context)}
      />
      <ContextForm 
        contentType="dialogue"
        onContextChange={(context) => console.log('Dialogue context:', context)}
      />
    </div>
  );
}