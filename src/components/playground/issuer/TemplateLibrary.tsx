import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  credentialTemplates,
  sectors,
  countries,
  templateToSchema,
  getSectorName,
  getSubsectorName,
  type CredentialTemplate,
} from "@/data/credentialTemplates";
import type { CredentialSchema } from "@/types/playground";

interface TemplateLibraryProps {
  selectedCountry: string;
  selectedSector: string;
  onCountryChange: (country: string) => void;
  onSectorChange: (sector: string) => void;
  onSelectTemplate: (schema: CredentialSchema, issuerName: string) => void;
  selectedTemplateId?: string;
}

export function TemplateLibrary({
  selectedCountry,
  selectedSector,
  onCountryChange,
  onSectorChange,
  onSelectTemplate,
  selectedTemplateId,
}: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set(["public-sector"]));
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  // Filter templates based on search and sector
  const filteredTemplates = useMemo(() => {
    let templates = credentialTemplates;

    // Filter by sector if selected
    if (selectedSector && selectedSector !== "all" && !showAllTemplates) {
      templates = templates.filter(t => t.sector === selectedSector);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.useCase.toLowerCase().includes(query) ||
          t.benefit.toLowerCase().includes(query) ||
          getSectorName(t.sector).toLowerCase().includes(query)
      );
    }

    return templates;
  }, [selectedSector, searchQuery, showAllTemplates]);

  // Group templates by sector and subsector
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, Record<string, CredentialTemplate[]>> = {};

    filteredTemplates.forEach(template => {
      if (!groups[template.sector]) {
        groups[template.sector] = {};
      }
      if (!groups[template.sector][template.subsector]) {
        groups[template.sector][template.subsector] = [];
      }
      groups[template.sector][template.subsector].push(template);
    });

    return groups;
  }, [filteredTemplates]);

  const toggleSector = (sectorId: string) => {
    setExpandedSectors(prev => {
      const next = new Set(prev);
      if (next.has(sectorId)) {
        next.delete(sectorId);
      } else {
        next.add(sectorId);
      }
      return next;
    });
  };

  const handleSelectTemplate = (template: CredentialTemplate) => {
    const countryCode = selectedCountry || "global";
    const issuerName = template.issuerAuthority[countryCode] || template.issuerAuthority.global || template.issuerType;
    const schema = templateToSchema(template, countryCode);
    onSelectTemplate(schema, issuerName);
  };

  return (
    <div className="space-y-5">
      {/* Pre-qualification Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Customize for Your Context
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Region</Label>
              <Select value={selectedCountry} onValueChange={onCountryChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Sector</Label>
              <Select value={selectedSector} onValueChange={(value) => {
                onSectorChange(value);
                setShowAllTemplates(false);
                if (value && value !== "all") {
                  setExpandedSectors(new Set([value]));
                }
              }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search credential templates..."
            className="pl-9 h-9"
          />
        </div>

        {/* Show All Templates Toggle */}
        {selectedSector && selectedSector !== "all" && (
          <button
            onClick={() => setShowAllTemplates(!showAllTemplates)}
            className="text-xs text-primary hover:underline"
          >
            {showAllTemplates ? "Show filtered templates" : "Show all templates"}
          </button>
        )}
      </div>

      {/* Template Library */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Credential Template Library
        </h4>
        
        <ScrollArea className="h-[320px] rounded-lg border border-border bg-muted/20">
          <div className="p-3 space-y-2">
            {Object.keys(groupedTemplates).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No templates found matching your criteria
                </p>
              </div>
            ) : (
              sectors
                .filter(sector => groupedTemplates[sector.id])
                .map(sector => (
                  <div key={sector.id} className="space-y-1">
                    {/* Sector Header */}
                    <button
                      onClick={() => toggleSector(sector.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 transition-colors"
                    >
                      {expandedSectors.has(sector.id) ? (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {sector.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {Object.values(groupedTemplates[sector.id] || {}).flat().length} templates
                      </span>
                    </button>

                    {/* Subsectors & Templates */}
                    {expandedSectors.has(sector.id) && (
                      <div className="ml-5 space-y-1">
                        {sector.subsectors
                          .filter(subsector => groupedTemplates[sector.id]?.[subsector.id])
                          .map(subsector => (
                            <div key={subsector.id} className="space-y-1">
                              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 pt-2">
                                {subsector.name}
                              </p>
                              {groupedTemplates[sector.id][subsector.id].map(template => (
                                <TemplateCard
                                  key={template.id}
                                  template={template}
                                  selectedCountry={selectedCountry}
                                  isSelected={selectedTemplateId === template.id}
                                  onSelect={() => handleSelectTemplate(template)}
                                />
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: CredentialTemplate;
  selectedCountry: string;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, selectedCountry, isSelected, onSelect }: TemplateCardProps) {
  const issuerAuthority = template.issuerAuthority[selectedCountry] || template.issuerAuthority.global || template.issuerType;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">
              {template.useCase}
            </p>
            {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {issuerAuthority}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            {template.benefit}
          </p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-border/50">
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="w-full h-7 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? "Selected" : "Use this Template"}
        </Button>
      </div>
    </button>
  );
}
