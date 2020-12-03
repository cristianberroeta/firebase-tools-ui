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

import './index.scss';

import { IconButton } from '@rmwc/icon-button';
import React, { useEffect } from 'react';
import { MapDispatchToPropsFunction, connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createStructuredSelector } from '../../../store';
import { addRequestEvaluation } from '../../../store/firestoreRules';
import { getAllRequestEvaluations } from '../../../store/firestoreRules/selectors';
import { CustomThemeProvider } from '../../../themes';
import { FirestoreRulesEvaluation } from './rules_evaluation_result_model';
import { registerForRulesEvents } from './rules_evaluations_listener';
import { useEvaluationCleanData } from './utils';

const EvaluationRow: React.FC<{
  evaluation: FirestoreRulesEvaluation;
  evaluationId: string;
}> = ({ evaluation, evaluationId }) => {
  const [
    outcome,
    requestTimeComplete,
    requestTimeFromNow,
    requestMethod,
    resourceSubPaths,
    outcomeData,
  ] = useEvaluationCleanData(evaluation);

  return (
    <tr>
      <CustomThemeProvider use={outcomeData[outcome]?.theme} wrap>
        <td
          className="Firestore-Evaluation-Outcome"
          title={outcomeData[outcome]?.label}
        >
          <IconButton
            icon={outcomeData[outcome]?.icon}
            tag={Link}
            to={`/firestore/rules/${evaluationId}`}
          />
        </td>
      </CustomThemeProvider>
      <td className="Firestore-Evaluation-Method">{requestMethod}</td>
      <td className="Firestore-Evaluations-Table-Path-Data">
        {resourceSubPaths?.map((subpath, index) => (
          <React.Fragment key={`${subpath}-${index}`}>
            <span className="Firestore-Evaluation-Path-Slash"> / </span>
            <span
              title="copy subpath"
              className="Firestore-Evaluation-Path-Subpath"
              onClick={() => {
                navigator.clipboard.writeText(subpath);
              }}
            >
              {' '}
              {subpath}{' '}
            </span>
          </React.Fragment>
        ))}
      </td>
      <td className="Firestore-Evaluation-Date" title={requestTimeComplete}>
        {requestTimeFromNow}
      </td>
    </tr>
  );
};

export interface PropsFromState {
  evaluations: FirestoreRulesEvaluation[] | undefined;
}
export interface PropsFromDispatch {
  addEvaluation: typeof addRequestEvaluation;
}

export type Props = PropsFromState & PropsFromDispatch;

export const EvaluationsTable: React.FC<Props> = ({
  evaluations,
  addEvaluation,
}) => {
  useEffect(() => {
    const callbackFunction = (newEvaluation: FirestoreRulesEvaluation) => {
      console.log('dev: newEvaluation', newEvaluation);
      const { type } = newEvaluation;
      if (type === 'RULES_UPDATE') {
        // TODO: UPDATE RULES
      } else {
        addEvaluation(newEvaluation);
      }
    };
    const unsubscribeFromRules = registerForRulesEvents(callbackFunction);
    return () => unsubscribeFromRules();
  }, [addEvaluation]);

  return (
    <div className="Firestore-Evaluations-Table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="Firestore-Evaluations-Table-Method-Header">
              Method
            </th>
            <th className="Firestore-Evaluations-Table-Path-Header">Path</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {evaluations?.map((evaluation: FirestoreRulesEvaluation) => {
            const { evaluationId } = evaluation;
            return (
              <EvaluationRow
                key={evaluationId}
                evaluationId={evaluationId}
                evaluation={evaluation}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const mapStateToProps = createStructuredSelector({
  evaluations: getAllRequestEvaluations,
});
export const mapDispatchToProps: MapDispatchToPropsFunction<
  PropsFromDispatch,
  {}
> = dispatch => ({
  addEvaluation: (newEvaluation: FirestoreRulesEvaluation) =>
    dispatch(addRequestEvaluation(newEvaluation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationsTable);