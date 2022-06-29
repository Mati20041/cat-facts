import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import formatDate from 'date-fns/format';
import parseDate from 'date-fns/parseISO';
import { CatFactDto, catService } from './CatService';
import { Spinner } from '../Spinner';
import { StyledCard } from '../StyledParts';

export const CatTiles = () => {
  const { data: catFacts, isFetching } = useQuery(
    'cats',
    catService.fetchCatData.bind(catService),
    {
      onError: (err) => {
        console.error('Error while fetching cat facts', err);
      },
    }
  );

  if (isFetching) {
    return (
      <StyledTiles>
        <Spinner />
      </StyledTiles>
    );
  }
  return (
    <StyledTiles>
      {catFacts != null ? (
        catFacts.map((fact) => <CatTile key={fact._id} fact={fact} />)
      ) : (
        <div>Error receiving cat facts</div>
      )}
    </StyledTiles>
  );
};

const StyledTiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  width: 100%;
  justify-content: center;
`;

const CatTile = ({ fact }: { fact: CatFactDto }) => (
  <StyledTile>
    <h4>{fact.text}</h4>
    <p>Source: {fact.source}</p>
    <p>Created: {formatDate(parseDate(fact.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
  </StyledTile>
);

const StyledTile = styled(StyledCard)`
  flex-direction: column;
  padding: 1rem;
  width: 20rem;
  height: 15rem;

  h4 {
    color: darkcyan;
    flex-grow: 1;
  }
`;
