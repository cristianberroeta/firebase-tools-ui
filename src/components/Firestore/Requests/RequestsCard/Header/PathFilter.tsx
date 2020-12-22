/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './PathFilter.scss';

import { TextField } from '@rmwc/textfield';
import keycode from 'keycode';
import React, { useState } from 'react';

export const PathFilter: React.FC<{}> = () => {
  const [searchText, setSearchText] = useState<string>('');

  const clearSearchText = () => {
    setSearchText('');
  };

  return (
    <form
      role="search"
      className="Firestore-Requests-Header-Path-Filter"
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <TextField
        className="Firestore-Requests-Header-Path-Filter-Text"
        onChange={(input: React.ChangeEvent<HTMLInputElement>) => {
          setSearchText(input.target.value);
        }}
        placeholder="Search by request path"
        value={searchText}
        aria-label="filter"
        fullwidth
        type="text"
        // inputRef={filterEl}
        outlined={false}
        ripple={false}
        icon="search"
        trailingIcon={
          searchText && {
            icon: 'close',
            role: 'button',
            'aria-label': 'clear',
            onClick: clearSearchText,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (
                e.keyCode === keycode('spacebar') ||
                e.keyCode === keycode('enter')
              ) {
                clearSearchText();
                e.preventDefault();
              }
            },
          }
        }
      />
    </form>
  );
};

export default PathFilter;