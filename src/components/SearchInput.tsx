import TextField from '~/core/ui/TextField';
import { useState } from 'react';

const SearchInput: React.FCC<{
  query?: string;
  path: string;
}> = (props) => {
  const [query, setQuery] = useState(props.query);

  return (
    <form action={props.path} method={'GET'}>
      <input type={'hidden'} name={'query'} value={query} />

      <TextField>
        <TextField.Label>
          Search
          <TextField.Input
            placeholder={'Type your query...'}
            required
            value={query}
            onChange={(e) =>
              setQuery((e.currentTarget as HTMLInputElement).value)
            }
          />
        </TextField.Label>
      </TextField>
    </form>
  );
};

export default SearchInput;
