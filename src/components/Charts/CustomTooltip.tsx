import { Box } from '@chakra-ui/react';

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className=" custom-tooltip__label">{label}</p>
        <div className="custom-tooltip__desc">
          {payload.map((entry: any, index: number) => (
            <Box
              as={'div'}
              key={index}
              className="custom-tooltip__desc__detail"
            >
              <span style={{ backgroundColor: `${entry.fill}` }}></span>
              <span>{`${entry.name}:  `}</span>
              <span>{entry.value}</span>
              <br />
            </Box>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
