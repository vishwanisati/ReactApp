import { useFormData } from './useFormData';
import { useNavigate } from 'react-router-dom';
import { useDbUpdate, useAuthState } from '../utilities/firebase';

const InputField = ({name, text, state, change}) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">{text}</label>
    <input className="form-control" id={name} name={name} 
      defaultValue={state.values?.[name]} onChange={change} />
    <div className="invalid-feedback">{state.errors?.[name]}</div>
  </div>
);

const ButtonBar = ({message}) => {
    const navigate = useNavigate();

  return (
    <div className="d-flex">
      <button type="button" className="btn btn-outline-dark me-2" onClick={() => navigate('/')}>Cancel</button>
      <button type="submit" className="btn btn-success me-auto" onChange = {Form} onClick={() => navigate('/')}>Submit</button>
      <span className="p-2">{message}</span>
    </div>
  );
};
const checkData = (key, val) => {
  switch (key) {
    case 'title':
      return /(^\w\w)/.test(val) ? '' : 'input must have at least two characters';
    case 'meets':
      return /^$|^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/.test(val) 
        ? '' : 'input must contain days from start to end (Example: MWF 12:30-13:20)';
    default: return 'enter text above'
  }
}

const Form = ({values, id}) => {

  //update the course with given inputs
  const [update, result] = useDbUpdate(`/courses/${id}`);
  const [state, change] = useFormData(checkData, values);
  const submit = (evt) => {
    evt.preventDefault();
    if (!state.errors) {
      update(state.values)
    }
  };

  return (
    <form onSubmit={submit} noValidate className={state.errors ? 'was-validated' : null}>
      <InputField name="title" text="Title" state={state} change={change} />
      <InputField name="meets" text="Meeting Times" state={state} change={change} />
      <ButtonBar message={result} />
    </form>
  )
};
export default Form;