import { useState } from 'react';

interface CuringInputProps {
    siteId: string;
    curingTypeId: string;
    startDate: string;
    endDate: string;
}

export const useCuringInputValidate = (props: CuringInputProps) => {
    const { siteId, curingTypeId, startDate, endDate } = props;

    const initialError = {
        siteId: '',
        curingTypeId: '',
        startDate: '',
        endDate: '',
    };

    const [error, setError] = useState(initialError);

    const resetErrors = () => setError(initialError);

    const validate = () => {
        resetErrors();
        let isValid = true;

        const updateError = (field: keyof typeof initialError, message: string) => {
            setError(prev => ({ ...prev, [field]: message }));
            isValid = false;
        };

        if (!siteId.trim())
            updateError('siteId', 'Please select a site');
        if (!curingTypeId.trim())
            updateError('curingTypeId', 'Please select a curing type');
        if (!startDate.trim())
            updateError('startDate', 'Please select a start date');
        if (!endDate.trim())
            updateError('endDate', 'Please select an end date');
        if (startDate && endDate && new Date(startDate) > new Date(endDate))
            updateError('endDate', 'End date must be after start date');

        return isValid;
    };

    return { error, validate, setError, initialError };
};