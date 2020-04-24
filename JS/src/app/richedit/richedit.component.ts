import {
    create, createOptions, FileTabItemId, HomeTabItemId, Options,
    RibbonButtonItem, RibbonItem, RibbonTab, RibbonTabType, RichEdit, RibbonMenuItem, RibbonSubMenuItem
} from 'devexpress-richedit';

import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-richedit',
  template: '<div></div>',
  styleUrls: ['./richedit.component.css']
})
export class RicheditComponent implements AfterViewInit, OnDestroy {
  private rich: RichEdit;

  constructor(private element: ElementRef) { }

  ribbonCustomization(options: Options) {
    // remove items
    const fileTab = options.ribbon.getTab(RibbonTabType.File);
    fileTab.removeItem(FileTabItemId.OpenDocument);

    const homeTab = options.ribbon.getTab(RibbonTabType.Home);
    homeTab.removeItem(HomeTabItemId.Copy);
    homeTab.removeItem(HomeTabItemId.Cut);
    homeTab.removeItem(HomeTabItemId.Paste);

    homeTab.removeItem(HomeTabItemId.DecreaseFontSize);
    homeTab.removeItem(HomeTabItemId.IncreaseFontSize);

    homeTab.removeItem(HomeTabItemId.ChangeStyle);

    // remove element from drop down list
    // fileTab.removeItem(FileTabItemId.DownloadRtf);
    // fileTab.removeItem(FileTabItemId.DownloadTxt);

    // allow only download as docx. Create out item from default items
    const downloadDocxItem = fileTab.getItem(FileTabItemId.DownloadDocx) as RibbonSubMenuItem;
    const downloadItem = fileTab.getItem(FileTabItemId.Download) as RibbonMenuItem;
    fileTab.removeItem(FileTabItemId.Download);
    // icons: https://js.devexpress.com/Documentation/Guide/Themes_and_Styles/Icons/
    fileTab.insertItem(new RibbonButtonItem(downloadDocxItem.id, downloadItem.text, {icon: downloadItem.icon, showText: true}), 2);

    // move items to new tab
    const findElem: RibbonItem = homeTab.getItem(HomeTabItemId.Find);
    const replaceElem: RibbonItem = homeTab.getItem(HomeTabItemId.Replace);
    homeTab.removeItem(findElem);
    homeTab.removeItem(replaceElem);

    // remove tab
    options.ribbon.removeTab(RibbonTabType.References);

    // insert tab
    const findTabId = 'FindTabId';
    const newFindTab = options.ribbon.insertTab(new RibbonTab('Find', findTabId, [findElem, replaceElem]), 2);

    // add custom item
    const findInGoogleId = 'FindInGoogleId';
    newFindTab.insertItem(new RibbonButtonItem(findInGoogleId, 'Find in Google', { beginGroup: true }));
    options.events.customCommandExecuted = (s, e) => {
      if (e.commandName === findInGoogleId) {
        const selectedInterval = s.selection.intervals[0];
        if (selectedInterval.length > 0) {
          const selectedText = s.selection.activeSubDocument.getText(selectedInterval);
          window.open(`https://www.google.com/search?q=${selectedText}`, '_blank');
        }
      }
    };
  }  

  ngAfterViewInit(): void {
    const options: Options = createOptions();
    this.ribbonCustomization(options);

    options.width = '1700px';
    options.height = '800px';

    this.rich = create(this.element.nativeElement.firstElementChild, options);
  }

  ngOnDestroy() {
    if (this.rich) {
      this.rich.dispose();
      this.rich = null;
    }
  }
}
