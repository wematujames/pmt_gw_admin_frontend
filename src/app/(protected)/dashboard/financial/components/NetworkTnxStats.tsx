import { NetworkCollectionStat } from "@/types/types";
import { Avatar, Card, Col, Row, theme, Typography } from "antd";

const { Meta } = Card;

function NetworkStats({
  stats,
  loading,
}: {
  stats: NetworkCollectionStat[];
  loading: boolean;
}) {
  const { token } = theme.useToken();

  const logos = {
    "MTN-MoMo": "/mtnghlogo.jpg",
    "T-Cash": "/tcashlogo.jpg",
    "AT-Cash": "/atcashlogo.jpg",
  };

  return (
    <Row justify="space-evenly">
      {stats?.map((netrk: NetworkCollectionStat, idx) => (
        <Col key={netrk.network as string} xs={24} sm={12} md={8} lg={6}>
          <Card
            key={netrk.network}
            style={{
              marginTop: token.marginMD,
              marginBottom: token.marginMD,
            }}
            bordered={false}
            loading={loading}
          >
            <Meta
              avatar={<Avatar src={logos[netrk.network]} size={64} />}
              title={
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {netrk.network}
                </Typography.Title>
              }
              description={
                <>
                  <small>
                    Today: ₵ {parseFloat("" + netrk.today).toFixed(2)}
                  </small>
                  <br />
                  <small>
                    Total: ₵ {parseFloat("" + netrk.allTime).toFixed(2)}
                  </small>
                </>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default NetworkStats;
