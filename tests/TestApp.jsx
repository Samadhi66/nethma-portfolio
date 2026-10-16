import { MemoryRouter } from 'react-router';
import App from '../src/App';

export default function TestApp({path}) {
  return <MemoryRouter initialEntries={[path]}><App/></MemoryRouter>;
}
