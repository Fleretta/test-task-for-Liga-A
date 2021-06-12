import { useEffect, useState } from "react";
import axios from "axios";
import { GetStaticProps } from "next";
import styled from "styled-components";

const PageTitle = styled.h1`
  margin: 0;
  padding: 1em 0;

  color: #e1e5f0;
  font-size: 64px;
  text-align: center;

  @media (max-width: 1366px) {
    font-size: 48px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  margin: 0 1em 1em;
`;

interface CardProps {
  success: boolean;
}

const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 27vw;
  padding: 1em;
  margin-bottom: 1.3em;

  color: #e1e5f0;
  background: #25232e;

  border: 1px solid ${(props) => (props.success ? "#52C778" : "#D94C68")};
  border-radius: 20px;
  box-shadow: 0 0 15px ${(props) => (props.success ? "#52C778" : "#D94C68")};

  &:not(:nth-child(3n)) {
    margin-right: 1.3em;
  }

  @media (max-width: 1366px) {
    width: 42vw;

    &:not(:nth-child(3n)) {
      margin-right: 0;
    }

    &:not(:nth-child(2n)) {
      margin-right: 1.3em;
    }
  }

  @media (max-width: 1000px) {
    width: 86vw;

    &:not(:nth-child(2n)) {
      margin-right: 0;
    }
  }
`;

const CardTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FlightName = styled.div`
  margin-right: 1em;
  
  font-size: 32px;
  font-weight: 600;

  @media (max-width: 1366px) {
    font-size: 24px;
  }
`;

const Patch = styled.img`
  height: 3em;
`;

const MissionDetails = styled.div`
  margin: 1em 0 1.5em;

  font-size: 18px;
  line-height: 1.3em;

  @media (max-width: 1366px) {
    font-size: 16px;
  }
`;

const FlightDate = styled.div`
  font-size: 18px;

  @media (max-width: 1366px) {
    font-size: 16px;
  }
`;

type IndexProps = {
  launches: {
    id: string;
    name: string;
    date_utc: string;
    details: string;
    success: boolean;
    links: {
      patch: {
        small: string;
      };
    };
  }[];
};

const Index = (props: IndexProps) => {
  const [visibleCards, setVisibleCards] = useState(props.launches);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(2);

  const scrollHandler = () => {
    let windowRelativeBottom =
      document.documentElement.getBoundingClientRect().bottom;

    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
      setFetching(true);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => document.removeEventListener("scroll", scrollHandler);
  }, []);

  const params = {
    limit: 6,
    page: currentPage,
  };

  useEffect(() => {
    if (fetching) {
      axios
        .post(`https://api.spacexdata.com/v4/launches/query`, {
          options: params,
        })
        .then((response) => {
          visibleCards
            ? setVisibleCards([...visibleCards, ...response.data.docs])
            : setVisibleCards([...response.data.docs]);
          setCurrentPage((prev) => prev + 1);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching]);

  return (
    <>
      <PageTitle>List of SpaceX launches</PageTitle>
      <CardContainer>
        {visibleCards?.map((launch) => {
          const date = new Date(launch.date_utc);
          return (
            <Card key={launch.id} success={launch.success}>
              <div>
                <CardTopContainer>
                  <FlightName>{launch.name}</FlightName>
                  <Patch src={launch.links.patch.small} />
                </CardTopContainer>
                <MissionDetails>{launch.details}</MissionDetails>
              </div>
              <FlightDate>
                Flight date: {new Intl.DateTimeFormat("ru").format(date)}{" "}
                {new Intl.DateTimeFormat("ru", {
                  hour: "numeric",
                  minute: "numeric",
                }).format(date)}
              </FlightDate>
            </Card>
          );
        })}
      </CardContainer>
    </>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const params = {
    limit: 6,
    page: 1,
  };

  const response = await axios.post(
    `https://api.spacexdata.com/v4/launches/query`,
    { options: params }
  );

  const launches = response.data.docs;

  return {
    props: { launches },
  };
};
