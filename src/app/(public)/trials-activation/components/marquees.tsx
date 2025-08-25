'use client';
import { Stack } from '@mui/material';
import Marquee from 'react-fast-marquee';
import { AUTHORS_NEW } from '@/assets/images';
import Image from 'next/image';

const Marquees = () => {
  const AUTHORS_IMAGES = [
    AUTHORS_NEW.author1New,
    AUTHORS_NEW.author2New,
    AUTHORS_NEW.author3New,
    AUTHORS_NEW.author4New,
    AUTHORS_NEW.author5New,
    AUTHORS_NEW.author6New,
  ];

  return (
    <Stack sx={{ gap: 2.5, mx: { xs: -2, sm: -3 } }}>
      <Marquee autoFill={true} speed={40}>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {AUTHORS_IMAGES.map((src, index) => (
            <Image
              key={index}
              {...{ src }}
              width={275}
              height={275}
              alt={`author-image-${index}`}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: '12px',
                marginRight: '20px',
              }}
            />
          ))}
        </Stack>
      </Marquee>
    </Stack>
  );
};

export default Marquees;
