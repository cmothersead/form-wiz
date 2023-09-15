<script lang="ts">
  import {
    beforeUpdate,
    createEventDispatcher,
    onDestroy,
    onMount,
  } from "svelte";
  import { offset, flip, shift, size } from "svelte-floating-ui/dom";
  import {
    createFloatingActions,
    type ComputeConfig,
  } from "svelte-floating-ui";
  import { Searcher } from "fast-fuzzy";
  import type { Item } from "$lib";

  const dispatch = createEventDispatcher();

  import ChevronIcon from "./ChevronIcon.svelte";
  import ClearIcon from "./ClearIcon.svelte";

  export let id = "";
  export let name = "";
  export let value = "";
  export let filterText = "";
  export let placeholder = "";
  export let items: Item[] = [];
  export let disabled = false;
  export let focused = false;
  export let closeListOnChange = true;

  export let searchable = false;
  export let clearable = true;
  export let listOpen = false;

  export let hideEmptyState = false;
  export let inputAttributes = {};
  export let hideChevron = false;
  export let showClearIcon = false;
  export let hoverItemIndex = 0;
  export let floatingConfig: ComputeConfig = {};

  export let inputClass = "";
  export let listClass = "";
  export let listItemClass = "";
  let prev_value: string;
  let prev_filterText: string;

  let container: HTMLElement | undefined = undefined;
  let input: HTMLElement | undefined = undefined;
  let list: HTMLElement | undefined = undefined;

  let _inputAttributes: { [key: string]: any } = {
    autocapitalize: "none",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: false,
    tabindex: 0,
    type: "text",
    "aria-autocomplete": "list",
  };
  function assignInputAttributes() {
    Object.assign(_inputAttributes, inputAttributes);

    if (!searchable) {
      _inputAttributes["readonly"] = true;
    }
  }

  function setupFilterText() {
    if (filterText.length === 0) return;

    listOpen = true;
  }

  function handleFilterEvent(items: Item[]) {
    if (listOpen) dispatch("filter", items);
  }

  onMount(() => {
    if (listOpen) focused = true;
    if (focused && input) input.focus();
  });

  beforeUpdate(async () => {
    prev_value = String(value);
    prev_filterText = filterText;
  });

  onDestroy(() => {
    list?.remove();
  });

  function dispatchSelectedItem() {
    if (!prev_value || value !== prev_value) {
      dispatch("input", value);
    }
  }

  function dispatchHover(i: number) {
    dispatch("hoverItem", i);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!focused) return;
    e.stopPropagation();
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        if (focused && !listOpen) {
          value = "";
        }
        closeList();
        break;
      case "Enter":
        e.preventDefault();

        if (listOpen) {
          if (filteredItems.length === 0) break;
          const hoverItem = filteredItems[hoverItemIndex];

          if (!!value && value === hoverItem.value) {
            closeList();
            break;
          } else {
            handleSelect(filteredItems[hoverItemIndex]);
          }
        } else {
          listOpen = true;
        }

        break;
      case "ArrowDown":
        e.preventDefault();

        if (!listOpen) {
          listOpen = true;
        }
        changeHoverIndex(1);

        break;
      case "ArrowUp":
        e.preventDefault();

        if (!listOpen) {
          listOpen = true;
        }
        changeHoverIndex(-1);

        break;
      case "Tab":
        if (listOpen && focused) {
          if (
            filteredItems.length === 0 ||
            (!!value && value === filteredItems[hoverItemIndex].value)
          )
            return closeList();

          e.preventDefault();
          handleSelect(filteredItems[hoverItemIndex]);
          closeList();
        }

        break;
      case "Backspace":
        if (filterText.length > 0) return;
        break;
    }
  }

  function handleFocus(e?: FocusEvent) {
    if (!input) return;
    if (focused && input === document?.activeElement) return;
    if (e) dispatch("focus", e);
    input.focus();
    focused = true;
  }

  function handleBlur(e?: FocusEvent) {
    if (!input) return;
    if (isScrolling) return;
    if (listOpen || focused) {
      dispatch("blur", e);
      focused = false;
      input.blur();
    }
  }

  function handleClick() {
    if (disabled) return;
    listOpen = !listOpen;
    focused = true;
    input?.focus();
  }

  function handleClear() {
    dispatch("clear", value);
    value = "";
    closeList();
    handleFocus();
  }

  function selectItem(selection: Item) {
    if (selection) {
      filterText = "";

      value = selection.value.toString();
      setTimeout(() => {
        if (closeListOnChange) closeList();
        input?.focus();
        dispatch("change", value);
        dispatch("select", selection);
      });
    }
  }

  function closeList() {
    filterText = "";
    listOpen = false;
  }

  export let ariaValue = (value: string) => {
    return `Option ${value}, selected.`;
  };

  export let ariaListOpen = (label: string, count: number) => {
    return `You are currently focused on option ${label}. There are ${count} results available.`;
  };

  export let ariaFocused = () => {
    return `Select is focused, type to refine list, press down to open the menu.`;
  };

  function handleAriaSelection() {
    return ariaValue(value);
  }

  function handleAriaContent() {
    if (!filteredItems || filteredItems.length === 0) return "";
    let _item = filteredItems[hoverItemIndex];
    if (listOpen && _item) {
      let count = filteredItems ? filteredItems.length : 0;
      return ariaListOpen(_item.label, count);
    } else {
      return ariaFocused();
    }
  }

  let isScrolling = false;
  let isScrollingTimer: NodeJS.Timeout;
  function handleListScroll() {
    clearTimeout(isScrollingTimer);
    isScrollingTimer = setTimeout(() => {
      isScrolling = false;
    }, 100);
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      focused &&
      container &&
      list &&
      !container.contains(event.target as Node)
    ) {
      handleBlur();
    }
  }

  function handleSelect(item: Item) {
    selectItem(item);
  }

  function handleHover(i: number) {
    if (isScrolling) return;
    hoverItemIndex = i;
  }

  function handleItemClick({ item, i }: { item: Item; i: number }) {
    if (!!value && value === item.value) return closeList();
    hoverItemIndex = i;
    handleSelect(item);
  }

  function changeHoverIndex(increment: number) {
    if (filteredItems.length === 0) {
      return (hoverItemIndex = 0);
    }

    if (increment > 0 && hoverItemIndex === filteredItems.length - 1) {
      hoverItemIndex = 0;
    } else if (increment < 0 && hoverItemIndex === 0) {
      hoverItemIndex = filteredItems.length - 1;
    } else {
      hoverItemIndex = hoverItemIndex + increment;
    }
  }

  function isItemActive(item: Item, value: string) {
    return !!value && value === item.value;
  }

  const activeScroll = scrollAction;
  const hoverScroll = scrollAction;

  function scrollAction(node: HTMLElement, scroll: boolean) {
    return {
      update(newScroll: boolean) {
        scroll = newScroll;
        if (scroll) {
          handleListScroll();
          node.scrollIntoView({ behavior: "auto", block: "nearest" });
        }
      },
    };
  }

  let _floatingConfig: ComputeConfig = {
    strategy: "absolute",
    placement: "bottom-start",
    middleware: [offset(5), size(), flip(), shift()],
    autoUpdate: false,
  };

  const [floatingRef, floatingContent] = createFloatingActions(_floatingConfig);

  $: selectedLabel =
    filterText === ""
      ? items.find((item) => item.value == value)?.label ?? ""
      : filterText;
  $: if (inputAttributes || !searchable) assignInputAttributes();
  $: if (value) dispatchSelectedItem();
  $: if (!focused && input) closeList();
  $: if (filterText !== prev_filterText) setupFilterText();
  $: dispatchHover(hoverItemIndex);
  $: hasValue = !!value || !!items.find((item) => item.value === value);
  $: showClear = showClearIcon && hasValue && clearable && !disabled;
  $: placeholderText = value !== "" ? "" : placeholder;
  $: ariaSelection = value ? handleAriaSelection() : "";
  $: ariaContext = handleAriaContent();
  $: if (prev_value && !value) dispatch("input", value);
  $: searcher = new Searcher(items, { keySelector: (item) => item.label });
  $: filteredItems =
    filterText == "" ? items : searcher.search(filterText).slice(0, 10);
  $: handleFilterEvent(filteredItems);
  $: scrollToHoverItem = hoverItemIndex;
  $: if (input && listOpen && !focused) handleFocus();
  $: if (filterText) hoverItemIndex = 0;
  $: if (focused && input !== document?.activeElement) input?.focus();
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeyDown} />

<div class="relative" bind:this={container}>
  <div
    class="input flex items-stretch px-3 cursor-pointer {inputClass}"
    class:cursor-text={searchable}
    on:pointerup|preventDefault={handleClick}
    on:mousedown|preventDefault
    use:floatingRef
    tabindex="-1"
    role="listbox"
  >
    <span
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions text"
      class="sr-only"
    >
      {#if focused}
        <span id="aria-selection">{ariaSelection}</span>
        <span id="aria-context">
          {ariaContext}
        </span>
      {/if}
    </span>

    <div class="flex items-center overflow-hidden w-full">
      {#if hasValue}
        <div class="absolute whitespace-nowrap overflow-hidden w-2/3">
          <slot name="selection" selection={value}>
            {selectedLabel}
          </slot>
        </div>
      {/if}

      <input
        class="bg-transparent border-0 ps-0 flex-grow"
        class:cursor-pointer={!searchable}
        on:keydown={handleKeyDown}
        on:focus={handleFocus}
        readOnly={!searchable}
        {..._inputAttributes}
        bind:this={input}
        bind:value={filterText}
        placeholder={placeholderText}
        {disabled}
      />
    </div>

    <div class="flex items-center space-x-1 cursor-pointer">
      {#if showClear}
        <button class="p-0" type="button" on:click={handleClear}>
          <slot name="clear-icon">
            <ClearIcon />
          </slot>
        </button>
      {/if}

      {#if !hideChevron}
        <div aria-hidden="true">
          <slot name="chevron-icon" {listOpen}>
            <ChevronIcon />
          </slot>
        </div>
      {/if}
    </div>

    <input {id} {name} type="hidden" bind:value />
  </div>
  {#if listOpen}
    <div
      bind:this={list}
      class="bg-surface-200 dark:bg-surface-800 drop-shadow-lg rounded-md overflow-y-auto max-h-72 w-full z-10 {listClass}"
      on:scroll={handleListScroll}
      on:pointerup|preventDefault|stopPropagation
      use:floatingContent={floatingConfig}
    >
      {#if filteredItems.length > 0}
        {#each filteredItems as item, i}
          <div
            on:mouseover={() => handleHover(i)}
            on:focus={() => handleHover(i)}
            on:click|stopPropagation={() => handleItemClick({ item, i })}
            on:keydown|preventDefault|stopPropagation
            tabindex="-1"
            role="option"
            aria-selected={isItemActive(item, value)}
            use:activeScroll={isItemActive(item, value)}
            use:hoverScroll={scrollToHoverItem === i}
            class="px-6 py-2 cursor-default {listItemClass}"
            class:bg-secondary-600={isItemActive(item, value)}
            class:bg-surface-300={hoverItemIndex === i &&
              !isItemActive(item, value)}
            class:dark:bg-surface-500={hoverItemIndex === i &&
              !isItemActive(item, value)}
          >
            <slot name="item" {item} index={i}>
              {item?.label}
            </slot>
          </div>
        {/each}
      {:else if !hideEmptyState}
        <slot name="empty">
          <div class="py-2 text-center text-gray-600 dark:text-gray-400">
            No options
          </div>
        </slot>
      {/if}
    </div>
  {/if}
</div>
