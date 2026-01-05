Sprite.prototype.updateHorrorGlitch = function() {
    if (!!this._horrorFilters.glitchFilter) {
        if (this._horrorFiltersGlitchSpecial && this._horrorFilters.glitchFilter.animated) {
            var glitchFilter = new PIXI.filters.GlitchFilter();
            var keys = ['slices', 'offset', 'sliceMin', 'sliceMax', 'animated', 'aniFrequency', 'aniStrength', 'refreshRequest'];
            this._horrorFilters.glitchFilter.refreshRequest = false;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                glitchFilter[key] = this._horrorFilters.glitchFilter[key];
            }
            var index = this._filters.indexOf(this._horrorFilters.glitchFilter);
            let old_glitchFilter = this._filters[index];
            this._filters[index] = this.updateHorrorGlitchEffect(glitchFilter);
            this._horrorFilters.glitchFilter = this._filters[index];
            // clean up old filter to prevent memory leak (why was it not being done automatically? idk)
            old_glitchFilter._canvas = null;
            old_glitchFilter.texture.destroy(true);
            old_glitchFilter.destroy(true);
        } if (this._horrorFiltersGlitchSpecial && this._horrorFilters.glitchFilter.refreshRequest) {
            this._horrorFilters.glitchFilter.refreshRequest = false;
            this._horrorFilters.glitchFilter.animated = false;
            var glitchFilter = new PIXI.filters.GlitchFilter();
            var keys = ['slices', 'offset', 'sliceMin', 'sliceMax', 'animated', 'aniFrequency', 'aniStrength', 'refreshRequest'];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                glitchFilter[key] = this._horrorFilters.glitchFilter[key];
                if (key === 'refreshRequest') {
                    this._horrorFilters.glitchFilter[key] = false;
                }
            }
            var index = this._filters.indexOf(this._horrorFilters.glitchFilter);
            glitchFilter.refresh();
            this._filters[index] = this.updateHorrorGlitchEffect(glitchFilter);
            this._horrorFilters.glitchFilter = this._filters[index];
        } else {
            this.updateHorrorGlitchEffect(this._horrorFilters.glitchFilter);
        }
    }
};