import { useState, useRef, useEffect } from 'react';
import { useMaterialService } from '@/shared/features/materials/service/MaterialService';
import { useMaterialUsedService } from '@/shared/features/materials/service/MaterialUsedService';
import type { AvailableMaterialReport } from '@/shared/features/materials/service/MaterialUsedService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';

export type SelectedMaterial = {
    id: number;
    name: string;
};

export function useAvailableMaterialReportScreen({ navigate }: { navigate: (path: string) => void }) {
    const siteService = useSiteService();
    const materialService = useMaterialService();
    const materialUsedService = useMaterialUsedService();

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [reportData, setReportData] = useState<AvailableMaterialReport[]>([]);
    const [site, setSite] = useState({ name: '', value: '' });
    const [allSites, setAllSites] = useState<any[]>([]);
    const [siteList, setSiteList] = useState<any[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([]);
    const [materialList, setMaterialList] = useState<any[]>([]);
    const [date, setDate] = useState<string>('');
    const [appliedFilters, setAppliedFilters] = useState('');
    const [error, setError] = useState({ site: '', date: '' });
    const [isFilterOpen, setIsFilterOpen] = useState(false); // replaces BottomSheet

    // ── Derived ─────────────────────────────────────────────────────────────────
    const siteDetails = siteList.map(item => ({
        label: item.name,
        value: item.id.toString(),
        allItems: { value: item.id.toString(), name: item.name },
    }));

    const materialDetails = materialList.map(item => ({
        label: item.name,
        value: item.id.toString(),
    }));

    // ── API calls ────────────────────────────────────────────────────────────────
    const fetchSites = async (text = '') => {
        try {
            let source = allSites;
            if (!source.length) {
                const sites = await siteService.getSites({ status: 'Working' });
                if (!sites) return;
                setAllSites(sites);
                source = sites;
            }
            const lower = text.toLowerCase();
            setSiteList(
                text ? source.filter((s: any) => s.name.toLowerCase().includes(lower)) : source,
            );
        } catch (err) {
            console.log('fetchSites error:', err);
        }
    };

    const fetchMaterials = async (text = '') => {
        try {
            const res = await materialService.getMaterials(text);
            setMaterialList(res || []);
        } catch (err) {
            console.log('fetchMaterials error:', err);
        }
    };

    const validate = (): boolean => {
        const newError = { site: '', date: '' };
        let valid = true;

        if (!site.value) {
            newError.site = 'Site is required';
            valid = false;
        }
        if (!date) {
            newError.date = 'Date is required';
            valid = false;
        }

        setError(newError);
        return valid;
    };

    const fetchReport = async (override?: {
        siteId?: number;
        date?: Date;
        materialIds?: number[];
    }) => {
        const resolvedSiteId = override?.siteId ?? (site.value ? Number(site.value) : undefined);
        const resolvedDate = override?.date ?? date;
        const resolvedMaterialIds =
            'materialIds' in (override ?? {})
                ? override!.materialIds
                : selectedMaterials.map(m => m.id);

        if (!resolvedSiteId || !resolvedDate) return;

        setLoading(true);
        try {
            const data = await materialUsedService.getAvailableMaterialReport({
                siteId: resolvedSiteId,
                date: date,
                materialIds:
                    resolvedMaterialIds && resolvedMaterialIds.length > 0
                        ? resolvedMaterialIds
                        : undefined,
            });
            setReportData(data || []);
        } catch (err) {
            console.log('fetchReport error:', err);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!validate()) return;
        const parts: string[] = [];
        if (site.name) parts.push(site.name);
        if (date) parts.push(date.toString());
        if (selectedMaterials.length > 0)
            parts.push(`${selectedMaterials.length} material(s)`);
        setAppliedFilters(parts.join(', '));
        setIsFilterOpen(false); // replaces bottomSheetRef.current?.close()
        setError({ site: '', date: '' });
        fetchReport();
    };

    const handleClearSearch = () => {
        setSite({ name: '', value: '' });
        setSelectedMaterials([]);
        setDate('');
        setAppliedFilters('');
        setError({ site: '', date: '' });
        setReportData([]);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchReport().finally(() => setRefreshing(false));
    };

    const toggleMaterial = (id: number, name: string) => {
        setSelectedMaterials(prev => {
            const exists = prev.find(m => m.id === id);
            if (exists) return prev.filter(m => m.id !== id);
            return [...prev, { id, name }];
        });
    };

    const removeMaterial = (id: number) => {
        setSelectedMaterials(prev => prev.filter(m => m.id !== id));
    };

    const handleBack = () => {
        navigate('/home'); // replaces navigation.navigate(RouteName.HOME_SCREEN)
    };

    return {
        loading,
        refreshing,
        reportData,
        site,
        siteDetails,
        date,
        selectedMaterials,
        materialDetails,
        appliedFilters,
        error,
        isFilterOpen,        // replaces bottomSheetRef
        setIsFilterOpen,     // replaces bottomSheetRef.current?.open() / close()
        setSite,
        setDate,
        fetchSites,
        fetchMaterials,
        toggleMaterial,
        removeMaterial,
        handleSearch,
        handleClearSearch,
        handleRefresh,
        handleBack,
    };
}