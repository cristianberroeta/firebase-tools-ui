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

import '../index.scss';

import { Icon } from '@rmwc/icon';
import React, { useState } from 'react';

import { InspectionElement } from '../types';

export const InspectionBlock: React.FC<{
  label: string;
  value?: string;
  isMainBlock?: boolean;
}> = ({ label, value, isMainBlock, children }) => {
  const [isExpanded, setIsExpanded] = useState<Boolean>(!!isMainBlock);
  const elementClass = 'Firestore-Evaluation-Details-Inspection-Element';
  const mainElementClass = elementClass + '--Main';

  function displayContent() {
    return children ? (
      children
    ) : (
      <div
        title={value}
        className="Firestore-Evaluation-Details-Inspection-Element-Value"
      >
        {value}
      </div>
    );
  }

  return (
    <>
      <div
        className={`${elementClass} ${isMainBlock && mainElementClass}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span
          title={label}
          className="Firestore-Evaluation-Details-Inspection-Element-Label"
        >
          {' '}
          {label}{' '}
        </span>
        <Icon icon={{ icon: `expand_${isExpanded ? 'less' : 'more'}` }} />
      </div>
      {isExpanded && displayContent()}
    </>
  );
};

const EvaluationDetailsInspectionSection: React.FC<{
  inspectionElements?: InspectionElement[];
}> = ({ inspectionElements }) => (
  <div className="Firestore-Evaluation-Details-Inspection">
    <InspectionBlock isMainBlock label="Actions">
      <div>Action 1</div>
      <div>Action 2</div>
      <div>Action 3</div>
    </InspectionBlock>
    <InspectionBlock isMainBlock label="Query Information">
      <InspectionBlock label="limit" value="20" />
      <InspectionBlock label="orderBy" value="total_reviews" />
      <InspectionBlock label="where">
        <>
          <div>
            <span>name</span> <span>`{'=='}`</span> <span>'Pozole'</span>
          </div>
          <div>
            <span>avg_review_rate</span> <span>`{'>'}`</span> <span>4</span>
          </div>
        </>
      </InspectionBlock>
    </InspectionBlock>
    <InspectionBlock isMainBlock label="Expressions Inspection">
      <InspectionBlock label="isSignedIn()" value="false" />
      {inspectionElements?.map((inspectionElement, index) => {
        const { label, value } = inspectionElement;
        return <InspectionBlock key={index} label={label} value={value} />;
      })}
    </InspectionBlock>
  </div>
);

export default EvaluationDetailsInspectionSection;