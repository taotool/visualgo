/*
当Route的path为"/algorithms/:alg?"时，显示Algorithms组件

使用algs.js中的algorithms数组来渲染算法列表
algorithms数组中的每个算法对象包含以下属性：
- title: 算法名称
- img: 算法图片
- link: 算法链接
- segment: 算法分类
- more: 算法更多信息链接
*/

import { FC, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import IconButton from "@mui/material/IconButton";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { algorithms } from "../algs";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

console.log("######### Algorithms.tsx ######### ");

// Type for each algorithm object
interface Algorithm {
  title: string;
  img: string;
  link: string;
  segment: string;
  more?: string;
}

function Algorithms() {
  const theme = useTheme();
  const { alg } = useParams<{ alg?: string }>();
  const navigate = useNavigate();

  console.log("algorithms " + window.location.href + ", " + alg);

  return (
    <Box sx={{ flexGrow: 1, p: 0 , m: "0px"}}>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          cursor: "pointer",
          paddingLeft: "5px",
        }}
        onClick={() => navigate("/algorithms")}
      >
        {alg && "all | " + alg}
      </Typography>

      <Grid
        container
        spacing={1}
        sx={{
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
        }}
      >
        {algorithms
          .filter(
            (algorithm: Algorithm) => !alg || algorithm.segment === alg
          )
          .map((algorithm: Algorithm, idx: number) => (
            <Grid
              key={idx}
              minHeight={160}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
            >
              <Card>
                <CardMedia
                  component="img"
                  alt={algorithm.title}
                  height="200"
                  image={"./light/" + algorithm.img}
                  onClick={() => navigate(algorithm.link)}
                  className="imgFilter"
                  sx={{ cursor: "pointer" }}
                />
                <CardContent>
                  <Stack
                    spacing={0}
                    p={0}
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      paddingRight: "0px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: "text.primary", cursor: "pointer" }}
                      onClick={() => navigate(algorithm.link)}
                    >
                      {algorithm.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(algorithm.segment)}
                    >
                      {!alg && algorithm.segment}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

export default memo(Algorithms);
