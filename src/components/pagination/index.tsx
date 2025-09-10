'use client';

import { Pagination, Stack } from '@mui/material';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Select from '@/shared/inputs/select';

const CustomPagination = ({ totalItems }: any) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = useMemo(() => {
    if (isNaN(Number(searchParams.get('page')))) {
      return 1;
    }
    return Number(searchParams.get('page')) || 1;
  }, [searchParams]);

  const limit = useMemo(() => {
    if (isNaN(Number(searchParams.get('limit')))) {
      return 10;
    }
    return Number(searchParams.get('limit')) || 10;
  }, [searchParams]);

  const count = useMemo(() => {
    return Math.ceil(totalItems / limit);
  }, [totalItems, limit]);

  const handleChangeLimit = (event: any) => {
    const { value } = event.target;
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', value);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleChange = (event: any, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(value || 1));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Stack width={'100%'}
      direction='row'
      justifyItems='center'
      justifyContent='space-between'
      spacing={2}
    >
      <Select size='small' sx={{ width: 80 }}
        value={limit}
        handleChange={handleChangeLimit}
        options={[
          { id: 1, label: '10', value: 10 },
          { id: 2, label: '25', value: 25 },
          { id: 3, label: '50', value: 50 },
        ]}
      />
      <Pagination sx={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}} page={page} onChange={handleChange} count={count || 1} shape='rounded' />
    </Stack>
  );
};

export default CustomPagination;
